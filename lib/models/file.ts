import chalk from 'chalk';
import BlackViolation from "./black";
import Flake8Violation from "./flake";
import { PyrightViolation } from "./pyright";


export default class PyCheckFileReport {
  filepath: string;
  blackViolations: Set<BlackViolation> = new Set();
  flake8Violations: Set<Flake8Violation> = new Set();
  pyrightErrors: Set<PyrightViolation> = new Set();
  pyrightWarnings: Set<PyrightViolation> = new Set();
  pyrightInfos: Set<PyrightViolation> = new Set();

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  get hasBlackViolations(): boolean {
    return this.blackViolations.size > 0;
  }

  get hasFlake8Violations(): boolean {
    return this.flake8Violations.size > 0;
  }

  get hasPyrightViolations(): boolean {
    return this.pyrightErrors.size > 0;
  }

  get flake8ViolationCodes(): Set<string> {
    const codes = new Set<string>();
    this.flake8Violations.forEach((v) => {
      codes.add(v.code)
    });
    return codes;
  }

  get pyrightViolationRules(): Set<string> {
    const codes = new Set<string>();
    this.pyrightErrors.forEach((v) => {
      codes.add(v.rule)
    });
    return codes;
  }

  flake8suggestion(): Array<string> {
    return new Array<string>(
      chalk.gray("💡 Fix the problem in code or disable the check for the file using a comment on top:"),
      chalk.gray(`# flake8: noqa: ${Array.from(this.flake8ViolationCodes).join(",")}`)
    );
  }

  pyrightSuggestion(): Array<string> {
    const vtxt = new Set<string>();
    this.pyrightErrors.forEach((v) => {
      vtxt.add(v.rule + "=false");
    });
    return new Array<string>(
      chalk.gray("💡 Fix the problem in code or disable the check for the file using a comment on top:"),
      chalk.gray(`# pyright: ${Array.from(vtxt).join(",")}`)
    );
  }

  pyrightSummary() {
    let s = "";
    const pv = this.pyrightErrors.size;
    if (pv > 0) {
      s += `🔵 (${pv})`
    }
    return `${s} ${this.filepath}`;
  }

  flake8Summary() {
    let s = "";
    const fv = this.flake8Violations.size;
    if (fv > 0) {
      s += `🔴 (${fv})`
    }
    return `${s} ${this.filepath}`;
  }
}