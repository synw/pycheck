import { db } from './schema';
import { DbReportResult, BaseReportResult } from '@/interfaces';

async function selectLatestReport(pid: number): Promise<DbReportResult> {
  return new Promise((resolve, reject) => {
    const query = `SELECT *
FROM report
WHERE project_id = '${pid}'
AND report.timestamp = (
    SELECT MAX(timestamp)
    FROM report
);`;
    db.get(query, (err, row: DbReportResult) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function selectReports(project_id: number): Promise<BaseReportResult[]> {
  return new Promise((resolve, reject) => {
    const q = `SELECT * from report WHERE project_id=${project_id} ORDER BY timestamp ASC;`;

    const reports = new Array<BaseReportResult>();
    db.all(q, [], (err, rows: Array<DbReportResult>) => {
      if (err) {
        reject(err);
      } else {
        rows.map(row => {
          const report = {} as BaseReportResult;
          report.id = row.id;
          report.formattingScore = row.formattingScore;
          report.codestyleScore = row.codestyleScore;
          report.typingScore = row.typingScore;
          report.totalFilesBlackProcessed = row.totalFilesBlackProcessed;
          report.numBlackViolations = row.numBlackViolations;
          report.formattingScorePercent = row.formattingScorePercent;
          report.typingScorePercent = row.typingScorePercent;
          report.codestyleScorePercent = row.codestyleScorePercent;
          report.score = row.score;
          report.date = row.date;
          reports.push(report);
        });
        resolve(reports);
      }
    });
  });
}

/*function selectReports(project: string): ReportResultContract[] {
  const q = `SELECT reports.* FROM report JOIN 
project ON reports.project_id = project.id
WHERE project.name = '${project}';'`;

  const reports = new Array<ReportResultContract>();
  db.all(q, [], (err, rows: Array<DbReportResult>) => {
    if (err) {
      throw new Error(err.toString())
    }
    rows.map(row => {
      const report = {} as ReportResultContract;
      report.files = JSON.parse(row.files);
      report.formattingScore = row.formattingScore;
      report.codestyleScore = row.codestyleScore;
      report.typingScore = row.typingScore;
      report.totalFilesBlackProcessed = row.totalFilesBlackProcessed;
      report.numBlackViolations = row.numBlackViolations;
      report.disableTyping = row.disableTyping === 1;
      report.score = row.score;
      report.hasProblems = row.hasProblems === 1;
      report.hasMajorProblems = row.hasMajorProblems === 1;
      reports.push(report);
    });
  });
  return reports;
}*/

async function selectProject(name: string): Promise<{ id: number, name: string } | null> {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM project WHERE name='${name}'`;
    db.get(query, (err, row: { id: number, name: string }) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export { selectReports, selectProject, selectLatestReport }