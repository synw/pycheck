import Flake8Violation from "./flake";
import execute from "../commands/execute";
import { flakeIgnore, libDir } from "../const";
import { findPackages, lsl, pwd } from "../commands";
import BlackViolation from "./black";
import PyCheckFileReport from "./file";
import PyCheckReport from "./report";
import { PyrightViolation } from "./pyright";
import { readConf } from "../conf";
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
  report: PyCheckReport = new PyCheckReport();
  pyrightConfig = this.basePath + "pyrightconfig.json";
  hasPyrightConf = false;
  exclusionRules = new PyCheckExclusionRules();


  private constructor(path: string, name: string, dirs: Set<string>, files: Set<string>, isDebug: boolean) {
    this.name = name;
    this.dirs = dirs;
    this.files = files;
    this.basePath = path;
    this.isDebug = isDebug;
  }

  static async fromFolder(dirpath: string, isDebug: boolean = false, preset?: string): Promise<Project> {
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
    const proj = new Project(p, name, dirs, files, isDebug);
    let confPath = proj.basePath;
    // console.log("PRESET", preset)
    if (preset) {
      if (!presets.includes(preset)) {
        throw new Error(`Unknown preset ${preset}`);
      }
      confPath = libDir + "/conf/presets/" + preset + "/";
      proj.preset = preset;
    }
    const [hasConf, conf] = readConf(confPath);
    // console.log(hasConf, conf)
    if (hasConf) {
      proj.exclusionRules = PyCheckExclusionRules.fromConfig(conf)
    }
    proj.pyrightConfig = proj._pyrightConfig();
    return proj;
  }

  static empty(): Project {
    return new Project(".", "Searching ...", new Set(), new Set(), true);
  }

  async pyright(): Promise<Set<PyrightViolation>> {
    this.packages = await findPackages(this.basePath, this.dirs);
    //console.log("Packages:", packages)
    const violations = new Set<PyrightViolation>();
    for (const p of this.packages) {
      const cmd = `pyright --outputjson --lib -p ${this.pyrightConfig} ${this.basePath}${p}`;
      if (this.isDebug) {
        console.log(cmd)
      }
      await execute(cmd, {
        onError: (err) => {
          //console.log("PRY ERR", err)
          const res = JSON.parse(err.stdout);
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
                this.report.files[v.filepath].pyrightErrors.add(v);
                break;
              case "warning":
                this.report.files[v.filepath].pyrightWarnings.add(v);
                break;
              case "information":
                this.report.files[v.filepath].pyrightInfos.add(v);
            }
          }
        }
      })
    }
    return violations;
  }

  async black(): Promise<Set<BlackViolation>> {
    const violations = new Set<BlackViolation>();
    const exclude = `--extend-exclude='/*\/migrations/*|setup.py'`
    const cmd = `black --check --skip-string-normalization ${exclude} ${this.basePath}`;
    if (this.isDebug) {
      console.log(cmd)
    }
    await execute(cmd, {
      onError: (err) => {
        //console.log("ERRFOUND 1", err);
        for (const line of err.stderr.split("\n")) {
          if (line == "") {
            continue
          }
          if (line.startsWith("would reformat")) {
            const filepath = line.split(" ").slice(-1)[0].replace(this.basePath, "");
            const v = new BlackViolation(filepath);
            violations.add(v);
            if (!(filepath in this.report.files)) {
              this.report.files[filepath] = new PyCheckFileReport(filepath)
            }
            this.report.files[filepath].blackViolations.add(v)
          }
        }
      }
    });
    return violations;
  }

  async flake8(): Promise<Set<Flake8Violation>> {
    const opts = `--extend-exclude=${flakeIgnore.join(',')} --format='%(path)s|%(row)d,%(col)d|%(code)s|%(text)s'`;
    const cmd = `cd ${this.basePath} && flake8 . ${opts}`;
    if (this.isDebug) {
      console.log(cmd)
    }
    const violations = new Set<Flake8Violation>();
    await execute(cmd, {
      onError: (err) => {
        //console.log("ERRFOUND", err.stdout);
        for (const line of err.stdout.split("\n")) {
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
          this.report.files[filepath].flake8Violations.add(v);
        }
      }
    });
    return violations
  }

  private _pyrightConfig(): string {
    if (this.preset !== null) {
      return libDir + "/conf/presets/" + this.preset + "/pyrightconfig.json"
    }
    if (this.files.has("pyrightconfig.json")) {
      this.hasPyrightConf = true;
      return this.basePath + "pyrightconfig.json"
    }
    return libDir + "/conf/presets/default/pyrightconfig.json"
  }
}