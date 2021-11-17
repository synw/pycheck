

export function readConf(basePath: string): [boolean, Record<string, Record<string, Array<string>> | Array<string>>] {
  let conf: Record<string, Record<string, Array<string>> | Array<string>> = {};
  let hasConf = false;
  try {
    conf = require(basePath + 'pycheckconfig.json');
    hasConf = true;
  } catch (e) {
    hasConf = false;
    //throw new Error(`Can not read conf ${e}`)
  }
  return [hasConf, conf]
}

