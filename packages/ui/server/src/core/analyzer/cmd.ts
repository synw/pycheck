import PyCheckReport from "@pycheck/cli/bin/models/report";
import ProjectAnalyzer from ".";
import * as path from "path";

async function analyzeProject(dirPath: string, onProgress: (data: any) => void): Promise<PyCheckReport> {
  const { flake, pyright } = await ProjectAnalyzer.findConfig(dirPath);
  let preset;
  if (pyright === null) {
    preset = "django";
  }
  const libPath = path.join(__dirname + "../../../../node_modules/@pycheck/cli/bin");
  const engine = await ProjectAnalyzer.create(dirPath, flake, pyright, preset, libPath);
  await engine.runBlack();
  engine.proj.report.calculateScore()
  const res = {
    step: 1,
    numBlackViolations: engine.proj.report.numBlackViolations,
    totalFilesBlackProcessed: engine.proj.report.totalFilesBlackProcessed,
    formattingScore: engine.proj.report.formattingScore,
  }
  onProgress(res);
  const violations = await engine.runFlake();
  //console.log("Flake end", violations)
  engine.proj.report.calculateScore();
  const res2 = {
    step: 2,
    numFlakeViolations: violations.size,
    codestyleScore: engine.proj.report.codestyleScore,
  }
  onProgress(res2);
  await engine.runPyright();
  engine.proj.report.calculateScore();
  console.log("Analysis completed");
  return engine.proj.report
}

export { analyzeProject }