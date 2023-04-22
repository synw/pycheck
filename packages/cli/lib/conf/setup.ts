import * as fs from 'fs';
import * as ini from 'ini';

function escapeSpecialChars(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

function regexifyList(str: Array<string>): string {
  return str
    .map((item: string) => escapeSpecialChars(item.trim()))
    .join('|');
}

function readSetupConfig(filePath: string): { blackignore: string | null, preset: string | null } {
  let config: Record<string, any> = {};
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    config = ini.parse(fileContent)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return { blackignore: null, preset: null }
    } else {
      throw error
    }
  }
  const res: { blackignore: string | null, preset: string | null } = { blackignore: null, preset: null }
  let getBlackIgnoreFromFlake = true;
  if (config.pycheck) {
    if (config.pycheck.preset) {
      res.preset = config.pycheck.preset
    }
    if (config.pycheck["black-ignore"]) {
      getBlackIgnoreFromFlake = false;
      const bi = config.pycheck["black-ignore"];
      switch (bi) {
        case "disabled":
          break;
        default:
          res.blackignore = config.pycheck["black-ignore"]
          break;
      }
    }
  }

  if (getBlackIgnoreFromFlake) {
    //console.log("Get black ignore from flake", config.flake8)
    if (config.flake8 && config.flake8.exclude) {
      const excludeList = config.flake8.exclude.split(',');
      res.blackignore = regexifyList(excludeList);
    }
  }

  return res;
};

export { readSetupConfig }