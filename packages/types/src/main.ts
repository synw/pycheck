type Severity = 'error' | 'warning' | 'information';

interface PyrightViolationContract {
  filepath: string;
  message: string;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  severity: Severity;
  rule: string;
}

interface BlackViolationContract {
  filepath: string;
  diff: string;
}

interface Flake8ViolationContract {
  filepath: string;
  code: string;
  message: string;
  line: number;
  col: number;
}

interface PyCheckFileReportContract {
  filepath: string;
  blackViolations: boolean;
  flake8Violations: Array<Flake8ViolationContract>;
  pyrightErrors: Array<PyrightViolationContract>;
  pyrightWarnings: Array<PyrightViolationContract>;
  pyrightInfos: Array<PyrightViolationContract>;
}

interface PyCheckBaseScoreContract {
  formattingScore: number;
  codestyleScore: number;
  typingScore: number;
}

interface PyCheckBaseReportContract extends PyCheckBaseScoreContract {
  totalFilesBlackProcessed: number;
  numBlackViolations: number;
}

interface PyCheckReportContract extends PyCheckBaseReportContract {
  files: Record<string, PyCheckFileReportContract>;
}

export {
  Severity,
  PyrightViolationContract,
  BlackViolationContract,
  Flake8ViolationContract,
  PyCheckFileReportContract,
  PyCheckBaseScoreContract,
  PyCheckBaseReportContract,
  PyCheckReportContract,
}