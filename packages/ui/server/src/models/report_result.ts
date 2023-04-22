import { DbReportResult, ReportResultContract } from "@/interfaces";

class ReportResult {
  id: number;
  formattingScore: number;
  codestyleScore: number;
  typingScore: number;
  totalFilesBlackProcessed: number;
  numBlackViolations: number;
  score: number;
  timestamp: number;
  lastRun: number;
  files: Record<string, any>;
  disableTyping: boolean;
  hasProblems: boolean;
  hasMajorProblems: boolean;

  constructor(res: DbReportResult) {
    this.id = res.id;
    this.files = res.files ? JSON.parse(res.files) : {};
    this.formattingScore = res.formattingScore;
    this.codestyleScore = res.codestyleScore;
    this.typingScore = res.typingScore;
    this.totalFilesBlackProcessed = res.totalFilesBlackProcessed;
    this.numBlackViolations = res.numBlackViolations;
    this.score = res.score;
    this.timestamp = res.timestamp;
    this.lastRun = res.lastRun;
    this.disableTyping = res.disableTyping == 1;
    this.hasProblems = res.hasProblems == 1;
    this.hasMajorProblems = res.hasMajorProblems == 1;
  }
}

export { ReportResult }