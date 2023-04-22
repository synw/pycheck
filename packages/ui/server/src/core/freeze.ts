import { execute } from './execute';

async function pipFreeze(
  pipPath: string,
): Promise<Array<string>> {
  const _args = ["freeze"];
  return execute(pipPath, _args)
}

async function packagesDist(
  pythonPath: string,
): Promise<Array<string>> {
  const _args = ["-c", "'import json;from importlib.metadata import packages_distributions;print(json.dumps(packages_distributions()))'"];
  //console.warn("CMD", pythonPath, _args[0], _args[1])
  return execute(pythonPath, _args)
}

export { pipFreeze, packagesDist }