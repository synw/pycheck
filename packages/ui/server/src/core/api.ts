import { findPython, findMakefile, findPip, pythonVersion, ls } from "./py";
import { packagesDist, pipFreeze } from "./freeze";
import { analyzeProject } from "./analyzer/cmd";
import { runMakeCommand } from "./run_cmd"
import pickDirs from "./pick_dirs";
import openFile from "./open_file";
import openInEditor from "./open_editor";
import { execPath } from "../state";

const api = {
  versions: process.versions,
  findPython: findPython,
  findPip: findPip,
  packagesDist: packagesDist,
  findMakefile: findMakefile,
  pythonVersion: pythonVersion,
  runMakeCommand: runMakeCommand,
  openFile: openFile,
  openInEditor: openInEditor,
  ls: ls,
  pipFreeze: pipFreeze,
  pickDir: pickDirs,
  analyzeProject: analyzeProject,
};

export { api, execPath }