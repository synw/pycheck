import { Emo } from "emosd";
import { api } from "../core/api";
import { ProjectState } from "../interfaces";
import ServerLogLine from "./server_log";
import PythonPackage from "./package";

const log = new Emo({ zone: "project model" });

export class PyProject {
  id = 0;
  path = "";
  title = "";
  // paths
  managePyPath = "";
  pythonPath = "";
  pipPath = "";
  pythonVersion = "";
  // state
  state: ProjectState = "closed";
  // consoles
  cmdsOutput = new Array<ServerLogLine>();
  // parsed values
  pipPackages: Record<string, string> = {};
  pythonPackages = new Array<PythonPackage>();
  makeFileCommands = new Array<string>();

  get hasPythonPath(): boolean {
    return this.pythonPath.length > 0;
  }

  get hasPipPackages(): boolean {
    return Object.keys(this.pipPackages).length > 0;
  }

  get isClosed(): boolean {
    return this.state == "closed";
  }

  get relativePythonPath(): string {
    return (this.pythonPath).replace(this.path + '/', '')
  }

  runMakeCmd(cmd: string, handler: (data: any) => void, onFinished: () => void): () => boolean {
    return api.runMakeCommand(this.path, cmd, handler, onFinished);
  }

  async open(path: string): Promise<void> {
    log.section("opening project");
    log.start(path)
    if (!this.isClosed) {
      this.close()
      log.info("closing opened project")
    } else {
      this._resetState();
    }
    this.state = "scanning";
    this.path = path;
    this.title = this._titleFromPath(path);
  }

  close() {
    this._resetState()
  }

  private _resetState() {
    this.pythonVersion = "";
    this.pipPackages = {};
    this.makeFileCommands = new Array<string>();
    this.pythonPath = "";
    this.managePyPath = "";
    this.pipPath = "";
    this.pythonPackages = new Array<PythonPackage>();
    this.cmdsOutput = [];
  }

  private _titleFromPath(path: string) {
    return path.split("/").slice(-1)[0]
  }
}