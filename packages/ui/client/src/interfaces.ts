interface PythonPackage {
  pipName: string;
  packageName: string;
  version: string;
}

/** @type  "default" | "django" | "package" */
type SettingType = "default" | "django" | "package";

interface DjangoSettingValue {
  value: string;
  type: SettingType;
}

interface DjangoSettings {
  all: Record<string, DjangoSettingValue>;
}

/** @type  closed" | "scanning" | "opened */
type ProjectState = "closed" | "scanning" | "opened";

type FileType = "directory" | "python" | "image" | "db" | "html" | "js" | "ts" | "css" | "unknown";

interface FilesystemEntry {
  name: string;
  type: FileType;
}

interface ServerLogLine {
  raw: string;
  text: string;
  method: string;
  url: string;
  status: number;
  isStatic: boolean;
}

interface PyProject {
  path: string;
  title: string;
  // paths
  managePyPath: string;
  pythonPath: string;
  pipPath: string;
  pythonVersion: string;
  // state
  serverRuns: boolean;
  state: ProjectState;
  // consoles
  serverOutput: Array<ServerLogLine>;
  testOutput: Array<ServerLogLine>;
  cmdsOutput: Array<ServerLogLine>;
  // parsed values
  settings: DjangoSettings;
  djangoApps: Array<string>;
  externalApps: Array<string>;
  pipPackages: Record<string, string>;
  pythonPackages: Array<PythonPackage>;
  makeFileCommands: Array<string>;
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

interface BlackViolation {
  filepath: string;
  diff: string;
}

interface Flake8Violation {
  filepath: string;
  code: string;
  message: string;
  line: number;
  col: number;
}

type Severity = 'error' | 'warning' | 'information';

interface PyrightViolation {
  filepath: string;
  message: string;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  severity: Severity;
  rule: string;
}

interface PyCheckFileReport {
  filepath: string;
  blackViolations: Array<BlackViolation>;
  flake8Violations: Array<Flake8Violation>;
  pyrightErrors: Array<PyrightViolation>;
  pyrightWarnings: Array<PyrightViolation>;
  pyrightInfos: Array<PyrightViolation>;
}

interface PyCheckBaseReport {
  lastRun: number;
  timestamp: number;
  date: string;
  lastRunDate: string;
  formattingScore: number;
  codestyleScore: number;
  typingScore: number;
  formattingScorePercent: number;
  codestyleScorePercent: number;
  typingScorePercent: number;
}

interface PyCheckReport extends PyCheckBaseReport {
  files: Record<string, PyCheckFileReport>;
}

interface PyCheckHistoryReport extends PyCheckBaseReport {
  id: number;
  numBlackViolations: number;
  score: number;
  totalFilesBlackProcessed: number;
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
  ServerLogLine,
  FilesystemEntry,
  AnalysisResult,
  PyCheckReport,
  PyCheckFileReport,
  AnalysisViewsType,
  ChangeHistory,
  PyCheckHistoryReport
}