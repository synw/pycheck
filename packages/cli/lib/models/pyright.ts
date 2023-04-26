import type { Severity, PyrightViolationContract } from "@pycheck/types"


interface PyrightDiagnostic {
  file: string,
  severity: Severity,
  message: string,
  rule?: string,
  range: {
    start: {
      line: number,
      character: number
    },
    end: {
      line: number,
      character: number
    }
  }
}

export class PyrightViolation implements PyrightViolationContract {
  filepath: string;
  message: string;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  severity: Severity;
  rule: string;

  constructor(filepath: string, message: string, startLine: number, startCol: number,
    endLine: number, endCol: number, severity: Severity,
    rule?: string
  ) {
    this.filepath = filepath;
    this.message = message;
    this.startLine = startLine;
    this.startCol = startCol;
    this.endLine = endLine;
    this.endCol = endCol;
    this.severity = severity;
    this.rule = rule ?? "unknown";
  }

  get lineString(): string {
    let s = this.startLine.toString();
    if (this.endLine !== this.startLine) {
      s += " -> " + this.endLine.toString()
    }
    return s;
  }

  static fromDiagnostic(basePath: string, diagnostic: PyrightDiagnostic): PyrightViolation {
    return new PyrightViolation(
      diagnostic.file.replace(basePath, ""),
      diagnostic.message,
      diagnostic.range.start.line,
      diagnostic.range.start.character,
      diagnostic.range.end.line,
      diagnostic.range.end.character,
      diagnostic.severity,
      diagnostic.rule
    )
  }

  toMessage(): string {
    return `${this.lineString}: ${this.message} (${this.rule})`
  }
}