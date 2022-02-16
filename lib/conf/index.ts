import * as fs from "fs";

export function readConf(basePath: string): [boolean, Record<string, Record<string, Array<string>> | Array<string>>] {
  let conf: Record<string, Record<string, Array<string>> | Array<string>> = {};
  let hasConf = false;
  try {
    let rawdata = fs.readFileSync(basePath + 'pycheckconfig.json');
    conf = JSON.parse(rawdata.toString());
    hasConf = true;
  } catch (e) {
    hasConf = false;
    //throw new Error(`Can not read conf ${e}`)
  }
  return [hasConf, conf]
}

export function readPyrightConf(path: string): { ok: boolean, data: Record<string, any> } {
  let rawdata = fs.readFileSync(path);
  const res = { ok: false, data: {} };
  try {
    res.data = JSON.parse(rawdata.toString());
    res.ok = true;
  } catch (e) {
    console.warn("Error parsing pyright config file", path, ", skipping")
  }
  return res;
}
