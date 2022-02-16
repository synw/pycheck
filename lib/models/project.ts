import Flake8Violation from "./flake";
import { execute } from "../commands/execute";
import { flakeIgnore, libDir } from "../const";
import { findPackages, lsl, pwd } from "../commands";
import BlackViolation from "./black";
import PyCheckFileReport from "./file";
import PyCheckReport from "./report";
import { PyrightViolation } from "./pyright";
import { readConf, readPyrightConf } from "../conf";
import presets from "../conf/presets";
import PyCheckExclusionRules from "./rules";

export default class Project {
  name: string;
  isDebug: boolean;
  preset: string | null = null;
  dirs: Set<string> = new Set();
  files: Set<string> = new Set();
  output: Set<string> = new Set();
  basePath: string = "";
  packages: Set<string> = new Set();
  pyrightConfig = this.basePath + "pyrightconfig.json";
  hasPyrightConf = false;
  pyrightExcludeDirs = new Array<string>();
  exclusionRules = new PyCheckExclusionRules();
  report: PyCheckReport;


  private constructor(path: string, name: string, dirs: Set<string>, files: Set<string>, disableTyping: boolean, isDebug: boolean) {
    this.name = name;
    this.dirs = dirs;
    this.files = files;
    this.basePath = path;
    this.isDebug = isDebug;
    this.report = new PyCheckReport(disableTyping);
  }

  static async fromFolder(dirpath: string, disableTyping: boolean, isDebug: boolean = false, preset?: string, libPath?: string): Promise<Project> {
    let path = dirpath;
    if (dirpath === ".") {
      path = await pwd();
    }
    if (path.endsWith("/")) {
      path = path.slice(0, -1)
    }
    const name = `${path.split("/").pop()}`;
    //console.log("Path", path, "Name", name)
    const { dirs, files } = await lsl(path);
    let p = path;
    if (!p.endsWith("/")) {
      p = p + "/"
    }
    const proj = new Project(p, name, dirs, files, disableTyping, isDebug);
    let confPath = proj.basePath;
    //console.log("PRESET", preset);
    //console.log("LIBPATH", libPath);
    if (preset) {
      if (!presets.includes(preset)) {
        throw new Error(`Unknown preset ${preset}`);
      }
      if (libPath) {
        confPath = libPath + "/conf/presets/" + preset + "/";
      } else {
        confPath = libDir + "/conf/presets/" + preset + "/";
      }
      proj.preset = preset;
    }
    const [hasConf, conf] = readConf(confPath);
    // console.log(hasConf, conf)
    if (hasConf) {
      proj.exclusionRules = PyCheckExclusionRules.fromConfig(conf)
    }
    proj.pyrightConfig = proj._pyrightConfig(libPath);
    return proj;
  }

  static empty(): Project {
    return new Project(".", "Searching ...", new Set(), new Set(), false, true);
  }

  async pyright(): Promise<Set<PyrightViolation>> {
    this.packages = await findPackages(this.basePath, this.dirs);
    //console.log("Packages:", packages)
    const violations = new Set<PyrightViolation>();
    for (const p of this.packages) {
      if (this.pyrightExcludeDirs.includes(p)) {
        continue
      }
      const cmd = "pyright";
      const args = ["--outputjson", "--lib", "-p", this.pyrightConfig, `${this.basePath}${p}`]
      if (this.isDebug) {
        console.log(cmd, args.join(" "))
      }
      const resp = await execute(cmd, args, { onStderr: (e) => null })
      //console.log("RESP TO PARSE", resp)
      const res = JSON.parse(resp.join("\n"));
      for (const diagnostic of res.generalDiagnostics) {
        const v = PyrightViolation.fromDiagnostic(this.basePath, diagnostic);
        if (this.exclusionRules.hasRules) {
          if (this.exclusionRules.isMsgExcluded(v.message)) {
            continue;
          }
          if (this.exclusionRules.isErrorExcluded(v.rule)) {
            // console.log("IS EX", v.rule, this.exclusionRules.isErrorExcluded(v.rule))
            continue
          }
        }
        if (!(v.filepath in this.report.files)) {
          this.report.files[v.filepath] = new PyCheckFileReport(v.filepath)
        }
        switch (v.severity) {
          case "error":
            this.report.files[v.filepath].pyrightErrors.push(v);
            break;
          case "warning":
            this.report.files[v.filepath].pyrightWarnings.push(v);
            break;
          case "information":
            this.report.files[v.filepath].pyrightInfos.push(v);
        }
      }
    }
    return violations;
  }

  async black(): Promise<Set<BlackViolation>> {
    const violations = new Set<BlackViolation>();
    const exclude = `--extend-exclude='/*\/migrations/*|setup.py'`
    const args = ["--check", "--skip-string-normalization", exclude, this.basePath];
    const cmd = "black";
    if (this.isDebug) {
      console.log(cmd, args.join(" "))
    }
    await execute(cmd, args, {
      onError: (err) => console.log("SERR", err),
      onStderr: (err) => {
        //console.log("ERRFOUND 1", err);
        let i = 1;
        const lines = err.toString().split("\n");
        const nlines = lines.length;
        for (const line of lines) {
          if (line == "") {
            i++;
            continue
          }
          if (line.startsWith("would reformat")) {
            const filepath = line.split(" ").slice(-1)[0].replace(this.basePath, "");
            const v = new BlackViolation(filepath);
            violations.add(v);
            if (!(filepath in this.report.files)) {
              this.report.files[filepath] = new PyCheckFileReport(filepath)
            }
            //console.log("Adding black violation", JSON.stringify(v, null, "  "))
            this.report.files[filepath].blackViolations = true
          }
          //console.log(i, nlines, line);
          if ((i + 1) === nlines) {
            // get the total files analyzed from the last line
            ///console.log("LL", line)
            if (line.includes("reformatted")) {
              // has unchanged files
              const l = line.split(",");
              const toFormat = parseInt(l[0].trim().split(" ")[0])
              const unchanged = parseInt(l[1].trim().split(" ")[0])
              this.report.totalFilesBlackProcessed = toFormat + unchanged
            } else {
              // no unchanged files
              this.report.totalFilesBlackProcessed = parseInt(line.split(" ")[0])
            }
            // console.log("Total formated:", this.report.totalFilesBlackProcessed)
          }
          i++;
        }
      },
    });
    return violations;
  }

  async flake8({ maxLineLength, configFile }: {
    maxLineLength?: number,
    configFile?: string,
  } = {}): Promise<Set<Flake8Violation>> {
    const cmd = "flake8";
    const args = [
      this.basePath,
      `--extend-exclude=${flakeIgnore.join(',')}`,
      "--format='%(path)s|%(row)d,%(col)d|%(code)s|%(text)s'"
    ];
    if (maxLineLength) {
      args.push(`--max-line-length=${maxLineLength}`)
    }
    if (configFile) {
      const confPath = this.basePath + "/" + configFile
      args.push(`--config=${confPath}`)
    }
    if (this.isDebug) {
      console.log(cmd, args.join(" "))
    }
    const violations = new Set<Flake8Violation>();
    const res = await execute(cmd, args);
    for (const line of res) {
      if (line == "") {
        continue
      }
      const l = line.split("|");
      const code = l[2];
      const msg = l[3];
      const filepath = l[0].replace("./", "");
      const n = l[1].split(",");
      const col = parseInt(n[1]);
      const row = parseInt(n[0]);
      const v = new Flake8Violation(filepath, code, msg, col, row);
      violations.add(v);
      if (!(filepath in this.report.files)) {
        // console.log('Add', filepath)
        this.report.files[filepath] = new PyCheckFileReport(filepath)
      }
      //console.log("Adding Flake violation", v)
      this.report.files[filepath].flake8Violations.push(v);
    }
    return violations
  }

  private _pyrightConfig(libPath?: string): string {
    let p = libDir;
    if (libPath) {
      p = libPath;
    }
    if (this.preset !== null) {
      return p + "/conf/presets/" + this.preset + "/pyrightconfig.json"
    }
    if (this.files.has("pyrightconfig.json")) {
      //console.log("Custom pyright conf found")
      this.hasPyrightConf = true;
      // read exclusion rules
      const filename = this.basePath + "pyrightconfig.json";
      const pconf = readPyrightConf(filename);
      //console.log("PCONF", pconf)
      if ("exclude" in pconf) {
        //console.log("EX OK", pconf.exclude)
        this.pyrightExcludeDirs = pconf.exclude
      }
      return filename
    }
    return p + "/conf/presets/default/pyrightconfig.json"
  }
}