import type { Flake8ViolationContract } from "@pycheck/types";

export default class Flake8Violation implements Flake8ViolationContract {
  filepath: string;
  code: string;
  message: string;
  line: number;
  col: number;

  constructor(filepath: string, code: string, message: string, line: number, col: number) {
    this.filepath = filepath;
    this.code = code;
    this.message = message;
    this.line = line;
    this.col = col;
  }

  toMessage(): string {
    return `${this.line}: ${this.code} ${this.message}`
  }

  toString(): string {
    return `${this.filepath} : ${this.toMessage()}`
  }
}