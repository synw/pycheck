#!/usr/bin/env node

import Project from "./models/project";
import { argv } from "process";
import { readSetupConfig } from "./conf/setup";

async function main() {
  //console.log("Args", process.argv)
  let dirpath = ".";
  let isVerbose = false;
  let isDebug = false;
  let useSuggestions = false;
  let preset: string | undefined;
  let disableTyping = false;
  if (argv.length > 2) {
    for (const arg of argv.slice(2, argv.length)) {
      // parse args
      switch (arg) {
        case "-v":
          isVerbose = true;
          break;
        case "--untyped":
          preset = "untyped"
          break;
        case "--django":
          preset = "django"
          break;
        case "--debug":
          isDebug = true;
          break;
        case "-s":
          useSuggestions = true;
          break;
        case "--disable-typing":
          disableTyping = true;
          break;
        default:
          dirpath = arg;
      }
    }
  } else {
    dirpath = process.cwd()
  }
  // read conf
  const conf = readSetupConfig(dirpath + "/setup.cfg");
  //console.log("CONF", conf);
  if (!preset) {
    if (conf.preset) {
      preset = conf.preset
    }
  }
  // create project
  const proj = await Project.fromFolder(dirpath, disableTyping, isDebug, preset);
  console.log("Project", (proj.name));
  if (preset) {
    console.log(`Using preset ${preset}`)
  }
  // black checks
  console.log("Checking formatting with Black ...")
  await proj.black(conf.blackignore ?? undefined);
  // flake 8 checks
  console.log("Checking codestyle with Flake8 ...")
  await proj.flake8();
  // pyright checks
  let confMsg = "";
  if (proj.hasPyrightConf) {
    confMsg = `using ${proj.name}/${proj.pyrightConfig.replace(proj.basePath, "")} `
  }
  if (disableTyping === false) {
    console.log(`Checking typing with Pyright ${confMsg}...`)
    await proj.pyright();
  }
  proj.report.calculateScore();
  // final report
  if (proj.report.hasMajorProblems) {

    let msg = `-----------------------
☢️  Found some problems:
-----------------------`
    /*if (!proj.report.hasMajorProblems) {
      msg = `⚠️  Found some minor problems:`
    }*/
    console.log(msg);
    // flake 8
    for (const p of Object.keys(proj.report.files)) {
      const problem = proj.report.files[p];
      if (problem.hasFlake8Violations) {
        console.log(problem.flake8Summary())
        for (const v of problem.flake8Violations) {
          console.log("  - " + v.toMessage())
        }
        if (useSuggestions) {
          console.log("  " + problem.flake8suggestion().join("\n    "))
        }
      }
    }
    // pyright
    for (const tv of Object.keys(proj.report.files)) {
      const file = proj.report.files[tv];
      if (file.hasPyrightViolations) {
        console.log(file.pyrightSummary())
        for (const v of file.pyrightErrors) {
          console.log("  - " + v.toMessage())
        }
        if (useSuggestions) {
          console.log("  " + file.pyrightSuggestion().join("\n    "))
        }
      }
    }
    // black
    if (proj.report.numBlackViolations > 0) {
      proj.report.printFormatingSummary(isVerbose);
    }
  } else if (proj.report.numBlackViolations > 0) {
    proj.report.printFormatingSummary(isVerbose);
  } else {
    console.log("✔️  All checks passed")
  }
  proj.report.print()
}

(async () => {
  try {
    await main();
  } catch (e) {
    throw e
  }
})();


