export default class PyCheckExclusionRules {
  exclude: Record<string, Set<string>> = {
    startsWith: new Set<string>(),
    contains: new Set<string>()
  }
  ignore = new Set<string>();
  hasRules = false;

  static fromConfig(config: Record<string, Record<string, Array<string>> | Array<string>>): PyCheckExclusionRules {
    const cls = new PyCheckExclusionRules();
    if ("exclude" in config) {
      if ("startsWith" in config.exclude) {
        cls.hasRules = true
        cls.exclude.startsWith = new Set<string>(config.exclude.startsWith);
      }
      if ("contains" in config.exclude) {
        cls.hasRules = true
        cls.exclude.contains = new Set<string>(config.exclude.contains);
      }
    }
    if ("ignore" in config) {
      cls.hasRules = true
      cls.ignore = new Set<string>(config.ignore as Array<string>)
    }
    return cls;
  }

  isErrorExcluded(errorType: string): boolean {
    for (const rule of this.ignore) {
      if (errorType === rule) {
        //console.log("Excluding", errorType, "VS", rule)
        return true
      }
    }
    return false
  }

  isMsgExcluded(msg: string): boolean {
    for (const rule of this.exclude.startsWith) {
      if (msg.startsWith(rule)) {
        // console.log("Excluding", msg, "VS", rule)
        return true
      }
    }
    for (const rule of this.exclude.contains) {
      if (msg.includes(rule)) {
        // console.log("Excluding", msg, "VS", rule)
        return true
      }
    }
    return false
  }
}