import chalk from 'chalk';
import { colors } from "../const";
import PyCheckFileReport from "./file";

export default class PyCheckReport {
  files: Record<string, PyCheckFileReport> = {};
  formatingScore = 10;
  codestyleScore = 60;
  typingScore = 30;
  totalFilesBlackProcessed = 0;
  disableTyping: boolean;

  constructor(disableTyping: boolean) {
    this.disableTyping = disableTyping;
  }

  get score(): number {
    this._calculateScore();
    return this.formatingScore + this.codestyleScore + this.typingScore
  }

  get hasProblems(): boolean {
    return Object.keys(this.files).length > 0;
  }

  get hasMajorProblems(): boolean {
    for (const k of Object.keys(this.files)) {
      const f = this.files[k];
      if (f.flake8Violations.size > 0 || f.pyrightErrors.size > 0) {
        return true
      }
    }
    return false;
  }

  get numBlackViolations(): number {
    let n = 0;
    Object.values(this.files).forEach((f) => {
      n += f.blackViolations.size;
    });
    return n
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

  private _calculateScore() {
    for (const k of Object.keys(this.files)) {
      const file = this.files[k];
      if (file.hasFlake8Violations) {
        this._decrementCodestyleViolations(file.flake8Violations.size);
      }
      if (file.hasPyrightViolations) {
        this._decrementTypingViolations(file.pyrightErrors.size);
      }
    }
    this.formatingScore = this._calcFormatingScore(this.numBlackViolations);
    if (this.disableTyping) {
      this.typingScore = 0;
    }
  }

  private _colorizeScore(score: number): string {
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

  private _calcFormatingScore(numViolations: number): number {
    //console.log("NV", numViolations, "/ T:", this.totalFilesBlackProcessed)
    if (numViolations === 0) {
      return 10
    }
    if (numViolations === this.totalFilesBlackProcessed) {
      return 0
    }
    return Math.round(((numViolations / this.totalFilesBlackProcessed) * 100) / 10);
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