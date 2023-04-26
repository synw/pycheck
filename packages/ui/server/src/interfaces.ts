import { PyCheckBaseReportContract } from "@pycheck/types";

/** @type  closed" | "scanning" | "opened */
type ProjectState = "closed" | "scanning" | "opened";

/** @type  "default" | "django" | "package" */
type SettingType = "default" | "django" | "package";

interface BaseReportResult extends PyCheckBaseReportContract {
  id: number;
  formattingScorePercent: number;
  codestyleScorePercent: number;
  typingScorePercent: number;
  score: number;
  timestamp: number;
  lastRun: number;
  date: string;
  lastRunDate: string;
}

interface DbReportResult extends BaseReportResult {
  files: string;
  disableTyping: number;
  hasProblems: number;
  hasMajorProblems: number
}

interface ReportResultContract extends BaseReportResult {
  files: Record<string, any>;
  disableTyping: boolean;
  hasProblems: boolean;
  hasMajorProblems: boolean
}

export type { ProjectState, SettingType, DbReportResult, ReportResultContract, BaseReportResult }