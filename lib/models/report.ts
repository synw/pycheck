import chalk from 'chalk';
import { colors } from "../const";
import PyCheckFileReport from "./file";

export default class PyCheckReport {
  files: Record<string, PyCheckFileReport> = {};
  formatingScore = 10;
  codestyleScore = 60;
  typingScore = 30;
  totalFilesBlackProcessed = 0;
  numBlackViolations: number = 0;
  disableTyping: boolean;

  constructor(disableTyping: boolean) {
    this.disableTyping = disableTyping;
  }

  get score(): number {
    return this.formatingScore + this.codestyleScore + this.typingScore
  }

  get hasProblems(): boolean {
    return Object.keys(this.files).length > 0;
  }

  get hasMajorProblems(): boolean {
    for (const k of Object.keys(this.files)) {
      const f = this.files[k];
      if (f.flake8Violations.length > 0 || f.pyrightErrors.length > 0) {
        return true
      }
    }
    return false;
  }

  print() {
    console.log(`Code score: ${chalk.bold(this._colorizeScore(this.score) + '/100')}`);
    console.log(`  - Formating: ${this.formatingScore}/10`);
    console.log(`  - Codestyle: ${this.codestyleScore}/60`);
    if (this.disableTyping) {
      const extra = this.disableTyping ? " (disabled)" : "";
      console.log(chalk.dim(`  - Typing: ${this.typingScore}/30${extra}`));
    } else {
      console.log(`  - Typing: ${this.typingScore}/30`);
    }
  }

  printFormatingSummary(isVerbose: boolean) {
    console.log(`⚫ ${this.numBlackViolations}/${this.totalFilesBlackProcessed} file${this.numBlackViolations > 1 ? 's' : ''} could be formated${isVerbose ? ':' : ''}`);
    if (isVerbose) {
      for (const k of Object.keys(this.files)) {
        const file = this.files[k];
        if (file.hasBlackViolations) {
          console.log("   " + file.filepath)
        }
      }
    }
  }

  calculateScore() {
    this.codestyleScore = 60;
    this.typingScore = 30;
    let numBlackViolations = 0;
    for (const k of Object.keys(this.files)) {
      const file = this.files[k];
      if (file.hasFlake8Violations) {
        this._decrementCodestyleViolations(file.flake8Violations.length);
      }
      if (file.hasPyrightViolations) {
        this._decrementTypingViolations(file.pyrightErrors.length);
      }
      if (file.hasBlackViolations) {
        numBlackViolations += 1;
      }
    }
    this.numBlackViolations = numBlackViolations;
    this.formatingScore = this._calcFormatingScore(numBlackViolations);
    if (this.disableTyping) {
      this.typingScore = 0;
    }
  }

  _colorizeScore(score: number): string {
    let s = score.toString();
    if (score <= 50) {
      s = colors.c50(s);
    } else if (score <= 69) {
      s = colors.c69(s);
    } else if (score <= 75) {
      s = colors.c70(s);
    } else if (score == 100) {
      s = colors.c100(s);
    } else {
      s = colors.c90(s)
    }
    return s;
  }

  _calcFormatingScore(numViolations: number): number {
    //console.log("NV", numViolations, "/ T:", this.totalFilesBlackProcessed)
    if (numViolations === 0) {
      return 10
    }
    if (numViolations === this.totalFilesBlackProcessed) {
      return 0
    }
    const rawScore = ((this.totalFilesBlackProcessed - numViolations) / this.totalFilesBlackProcessed) * 100 / 10
    if (Math.trunc(rawScore) == 9) {
      return 9
    }
    return Math.round(rawScore);
  }

  private _decrementCodestyleViolations(numViolations: number) {
    let s = this.codestyleScore;
    if (this.codestyleScore > 0) {
      let n = numViolations * 2;
      if (n > 5) {
        // max decrement per file
        n = 5;
      }
      s = s - n;
      if (s < 0) {
        s = 0;
      }
    }
    this.codestyleScore = s;
  }

  private _decrementTypingViolations(numViolations: number) {
    let s = this.typingScore;
    if (this.codestyleScore > 0) {
      let n = numViolations;
      s = s - n;
      if (s < 0) {
        s = 0;
      }
    }
    this.typingScore = s;
  }
}