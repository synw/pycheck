import { Emo } from "../packages/emo";
import { PyProject } from "./pyproject";
import { api } from "../core/api";
import PythonPackage from "./package";

const log = new Emo({ zone: "project scanner" });

export class ProjectScanner {
  step = 1;
  project: PyProject;

  constructor(project: PyProject) {
    this.project = project;
  }

  async scan(): Promise<void> {
    log.section("scanning project");
    log.start(this.project.path)
    //log.arrowIn("looking for a python env");
    await this._findPython();
    await this._pythonVersion();
    log.result("has python:", this.project.hasPythonPath, this.project.pythonPath);
    this.step = 2;
    const hasPip = await this._findPip()
    log.info("Pip path", this.project.pipPath);
    if (hasPip) {
      await this._pipFreeze();
      await this._pythonPackages()
    }
    this.step = 4;
    await this._findMakefile();
    this.step = 5;
    this.step = 6;
    log.sectionEnd()
  }

  private async _findPython() {
    let { value, found } = await api.findPython(this.project.path);
    if (found) {
      //console.log("Found python", value);
      this.project.pythonPath = value;
    } else {
      log.warning("Python env not found, using system python");
      this.project.pythonPath = "python3";
    }
  }

  private async _pythonVersion() {
    this.project.pythonVersion = await api.pythonVersion(this.project.pythonPath);
  }

  private async _findPip(): Promise<boolean> {
    let { value, found } = await api.findPip(this.project.path);
    if (found) {
      //console.log("Found python", value);
      this.project.pipPath = value;
    }
    return found
  }

  private async _findMakefile(): Promise<boolean> {
    const { value, found } = await api.findMakefile(this.project.path);
    if (found) {
      //console.log("Makefile", value)
      const cmds = this._parseMakefile(value)
      if (cmds.length > 0) {
        this.project.makeFileCommands = cmds;
      }
      //console.log("Makefile commands", cmds)
    }
    return found
  }

  async _pythonPackages(): Promise<void> {
    const res = await api.packagesDist(this.project.pythonPath);
    let data: Record<string, Array<string>> = {};
    if (res[0].length == 0) {
      console.log("No packages dist")
    } else {
      data = JSON.parse(res[0])
    }
    const distribution: Record<string, string> = {};
    for (const [packageName, pipNames] of Object.entries(data)) {
      distribution[pipNames[0]] = packageName;
    }
    for (const [name, version] of Object.entries(this.project.pipPackages)) {
      const packageName = distribution[name] ?? "";
      this.project.pythonPackages.push(new PythonPackage(name, packageName, version))
    }
  }

  async _pipFreeze(): Promise<void> {
    const res = await api.pipFreeze(this.project.pipPath);
    res.forEach((row) => {
      const l = row.split("==");
      if (l.length > 1) {
        this.project.pipPackages[l[0]] = l[1]
      }
    })
    //log.data("PIP PACKAGEs", this.project.pipPackages)
  }

  private _parseMakefile(content: string): Array<string> {
    const cmds = new Array<string>();
    content.split("\n").forEach((line) => {
      if (line.startsWith(".PHONY:")) {
        cmds.push(line.split(":")[1].trim())
      }
    });
    return cmds.sort();
  }
}
