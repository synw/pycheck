import BlackViolation from "@pycheck/cli/bin/models/black";
import Flake8Violation from "@pycheck/cli/bin/models/flake";
import Project from "@pycheck/cli/bin/models/project";
import { execute } from "../execute";
import { readSetupConfig } from "@pycheck/cli/bin/conf/setup";

export default class ProjectAnalyzer {
  proj: Project = Project.empty();
  flake8ConfigFile: string | null;
  pyrightConfigFile: string | null;
  config: { blackignore: string | null, preset: string | null };

  constructor(flake8Conf: string | null, pyrightConf: string | null) {
    this.flake8ConfigFile = flake8Conf;
    this.pyrightConfigFile = pyrightConf;
    this.config = { blackignore: null, preset: null };
  }

  static async create(dirpath: string, flake8Conf: string | null, pyrightConf: string | null, preset: string | undefined, libPath: string): Promise<ProjectAnalyzer> {
    const pyproj = await Project.fromFolder(dirpath, false, true, preset, libPath);
    const p = new ProjectAnalyzer(flake8Conf, pyrightConf);
    p.config = readSetupConfig(dirpath + "/setup.cfg");
    p.proj = pyproj;
    return p
  }

  static async findConfig(path: string): Promise<{ flake: string | null, pyright: string | null }> {
    const dirListing = await execute(`ls`, ["-a", path]);
    const res: { flake: string | null, pyright: string | null } = { flake: null, pyright: null }
    if (dirListing.includes(".flake8")) {
      res.flake = ".flake8"
    } else if (dirListing.includes("setup.cfg")) {
      res.flake = "setup.cfg"
    } else if (dirListing.includes("tox.ini")) {
      res.flake = "tox.ini"
    }
    if (dirListing.includes("pyrightconfig.json")) {
      res.pyright = "pyrightconfig.json";
    }
    return res
  }

  async runBlack(): Promise<Set<BlackViolation>> {
    console.log("Checking formatting with Black ...")
    return await this.proj.black(this.config.blackignore ?? undefined);
  }

  async runFlake(): Promise<Set<Flake8Violation>> {
    console.log("Checking codestyle with Flake8 ...")
    let res: Set<Flake8Violation>;
    if (!this.flake8ConfigFile) {
      res = await this.proj.flake8({ maxLineLength: 88 });
    } else {
      res = await this.proj.flake8({ configFile: this.flake8ConfigFile });
    }
    return res
  }

  async runPyright() {
    let confMsg = "";
    if (this.proj.hasPyrightConf) {
      confMsg = `using ${this.proj.name}/${this.proj.pyrightConfig.replace(this.proj.basePath, "")} `
    }
    console.log(`Checking typing with Pyright ${confMsg}...`)
    await this.proj.pyright();
  }
}