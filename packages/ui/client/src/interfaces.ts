import { PyCheckBaseScoreContract, PyCheckFileReportContract } from "@pycheck/types";

interface PythonPackage {
  pipName: string;
  packageName: string;
  version: string;
}

/** @type  closed" | "scanning" | "opened */
type ProjectState = "closed" | "scanning" | "opened";

type FileType = "directory" | "python" | "image" | "db" | "html" | "js" | "ts" | "css" | "unknown";

interface FilesystemEntry {
  name: string;
  type: FileType;
}

interface PyProject {
  path: string;
  title: string;
  // paths
  pythonPath: string;
  pipPath: string;
  pythonVersion: string;
  // state
  state: ProjectState;
  // parsed values
  pipPackages: Record<string, string>;
  pythonPackages: Array<PythonPackage>;
}

type ViewsType = "Infos" | "Analysis" | "History";

type AnalysisViewsType = "Files" | "Formating" | "Codestyle" | "Typing";

interface AnalysisResult {
  date: Date;
  score: number;
  formattingScore: number;
  codestyleScore: number;
  typingScore: number;
}

interface PyCheckBaseReport extends PyCheckBaseScoreContract {
  lastRun: number;
  timestamp: number;
  date: string;
  lastRunDate: string;
  formattingScorePercent: number;
  codestyleScorePercent: number;
  typingScorePercent: number;
}

interface PyCheckReport extends PyCheckBaseReport {
  files: Record<string, PyCheckFileReportContract>;
}

interface PyCheckHistoryReport extends PyCheckBaseReport {
  id: number;
  score: number;
}

interface ChangeHistory {
  formatting: Array<number>;
  codestyle: Array<number>;
  typing: Array<number>;
  score: Array<number>;
}

export {
  PyProject,
  ViewsType,
  FilesystemEntry,
  AnalysisResult,
  PyCheckReport,
  AnalysisViewsType,
  ChangeHistory,
  PyCheckHistoryReport
}