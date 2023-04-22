import { PythonShell } from 'python-shell';
import { execute } from '../execute';

let serverShell: PythonShell | undefined;

async function ls(dir: string, l = true): Promise<Array<string>> {
  const p = l ? "-la" : "-a"
  return await execute(`ls`, [p, "--group-directories-first", dir]);
}

async function findMakefile(dir: string): Promise<{ value: string, found: boolean }> {
  const res = await execute(`find ${dir}  -maxdepth 1 -type f -name "Makefile"`);
  let value = "";
  let found = false;
  if (res.length == 2) {
    const content = await execute(`cat ${dir}/Makefile`);
    value = content.join("\n");
    found = true;
  }
  return { value, found }
}

async function findPython(dir: string): Promise<{ value: string, found: boolean }> {
  const cmd = `find ${dir} -type l -name "python"`;
  //console.log(cmd);
  const res = await execute(cmd);
  let value = "";
  let found = false;
  if (res.length >= 2) {
    let v = "";
    for (const row of res) {
      // avoid using tox envs
      if (!row.includes(".tox/")) {
        v = row
        break
      }
    }
    value = v;
    found = v.length > 0;
  }
  return { value, found }
}

async function findPip(dir: string): Promise<{ value: string, found: boolean }> {
  const cmd = `find ${dir} -type f -executable -name "pip"`;
  //console.log(cmd);
  const res = await execute(cmd);
  let value = "";
  let found = false;
  if (res.length >= 2) {
    let v = "";
    for (const row of res) {
      // avoid using tox envs
      if (!row.includes(".tox/")) {
        v = row
        break
      }
    }
    value = v;
    found = v.length > 0;
  }
  return { value, found }
}

async function pythonVersion(pythonPath: string): Promise<string> {
  const _args = ["-c", "'import platform;print(platform.python_version())'"];
  //console.warn("CMD", pythonPath, _args[0], _args[1])
  const res = await execute(pythonPath, _args);
  return res[0]
}

export {
  findPython,
  findMakefile,
  findPip,
  pythonVersion,
  ls,
  serverShell,
}