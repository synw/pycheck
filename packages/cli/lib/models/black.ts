import type { BlackViolationContract } from "@pycheck/types";

export default class BlackViolation implements BlackViolationContract {
  filepath: string;
  diff: string;

  constructor(filepath: string, diff: string = "") {
    this.filepath = filepath;
    this.diff = diff;
  }

  toString(): string {
    return this.filepath
  }
}