import PyCheckReport from "@pycheck/cli/bin/models/report";
import { db } from './schema';

function insertProject(name: string) {
  const q = `INSERT INTO project (name) VALUES (?)`;
  db.run(q, [name], function (err) {
    if (err) {
      throw new Error(err.message);
    } else {
      console.log(`Project ${name} inserted`);
    }
  });
}

async function insertReport(report: PyCheckReport, project: number) {
  const insertQuery = `
    INSERT INTO report (
      files,
      formattingScore,
      codestyleScore,
      typingScore,
      score,
      formattingScorePercent,
      codestyleScorePercent,
      typingScorePercent,
      totalFilesBlackProcessed,
      numBlackViolations,
      disableTyping,
      hasProblems,
      hasMajorProblems,
      timestamp,
      date,
      lastRun,
      lastRunDate,
      project_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const now = Math.floor(Date.now() / 1000);
  const nowStr = new Date().toISOString()
  const insertValues = [
    JSON.stringify(report.files),
    report.formattingScore,
    report.codestyleScore,
    report.typingScore,
    report.score,
    Math.round((report.formattingScore * 100) / 10),
    Math.round((report.codestyleScore * 100) / 60),
    Math.round((report.typingScore * 100) / 30),
    report.totalFilesBlackProcessed,
    report.numBlackViolations,
    report.disableTyping ? 1 : 0,
    report.hasProblems ? 1 : 0,
    report.hasMajorProblems ? 1 : 0,
    now,
    nowStr,
    now,
    nowStr,
    project
  ];
  db.run(insertQuery, insertValues, (err) => {
    if (err) {
      throw new Error(err.message);
    } else {
      console.log("New report inserted");
    }
  });
}

export { insertReport, insertProject }