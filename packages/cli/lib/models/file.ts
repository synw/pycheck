import chalk from 'chalk';
import Flake8Violation from "./flake";
import { PyrightViolation } from "./pyright";
import type { PyCheckFileReportContract } from '@pycheck/types';


export default class PyCheckFileReport implements PyCheckFileReportContract {
  filepath: string;
  blackViolations: boolean = false;
  flake8Violations: Array<Flake8Violation> = [];
  pyrightErrors: Array<PyrightViolation> = [];
  pyrightWarnings: Array<PyrightViolation> = [];
  pyrightInfos: Array<PyrightViolation> = [];

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  get hasBlackViolations(): boolean {
    return this.blackViolations === true;
  }

  get hasFlake8Violations(): boolean {
    return this.flake8Violations.length > 0;
  }

  get hasPyrightViolations(): boolean {
    return this.pyrightErrors.length > 0;
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
    const pv = this.pyrightErrors.length;
    if (pv > 0) {
      s += `🔵 (${pv})`
    }
    return `${s} ${this.filepath}`;
  }

  flake8Summary() {
    let s = "";
    const fv = this.flake8Violations.length;
    if (fv > 0) {
      s += `🔴 (${fv})`
    }
    return `${s} ${this.filepath}`;
  }
}