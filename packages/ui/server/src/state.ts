import path from 'path';
import { selectProject } from "./db/select";
import { insertProject } from "./db/insert";
import { PyProject } from "./models/pyproject";
import { ProjectScanner } from "./models/project_scanner";

let project = new PyProject();
let projectScanner = new ProjectScanner(project);
const execPath = process.cwd();
const packagePath = path.dirname(__dirname);
let setReady: (value: unknown) => void;
let onReady = new Promise((r) => setReady = r);

async function mutateProject(dirpath: string): Promise<PyProject> {
  await project.open(dirpath);
  await projectScanner.scan();
  let pr = await selectProject(project.title);
  if (!pr) {
    // no project found in db, save the current one
    insertProject(project.title);
    pr = await selectProject(project.title);
  }
  if (!pr) {
    throw new Error("No project id")
  }
  project.id = pr.id;
  project.state = "opened";
  //console.log("State pid", project.id)
  return project
}

export { mutateProject, execPath, project, onReady, setReady, packagePath, projectScanner }