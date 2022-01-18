#!/usr/bin/env node

import Project from "./models/project";
import { pwd } from "./commands";
import { argv } from "process";

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
    dirpath = await pwd();
  }
  const proj = await Project.fromFolder(dirpath, disableTyping, isDebug, preset);
  console.log("Project", (proj.name));
  if (preset) {
    console.log(`Using preset ${preset}`)
  }
  // black checks
  console.log("Checking formating with Black ...")
  await proj.black();
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
    const bv = proj.report.numBlackViolations;
    if (bv > 0) {
      console.log(`⚫ ${bv} file${bv > 1 ? 's' : ''} could be formated${isVerbose ? ':' : ''}`);
      if (isVerbose) {
        for (const k of Object.keys(proj.report.files)) {
          const file = proj.report.files[k];
          for (const v of file.blackViolations) {
            console.log("   " + v.filepath)
          }
        }
      }
    }
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


