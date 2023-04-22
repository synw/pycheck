export default class BlackViolation {
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