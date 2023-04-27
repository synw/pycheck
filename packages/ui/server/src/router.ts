import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import { project, onReady } from './state';
import { api } from './core/api';
import { wsMsg } from './ws';
import { insertReport } from './db/insert';
import { selectLatestReport, selectReports } from './db/select';
import { updateTimestamp } from './db/update';
import { ReportResult } from './models/report_result';

const router = new Router();

router.get('/api/init', async (ctx) => {
  await onReady;
  const latestReport = await selectLatestReport(project.id);
  let report: ReportResult | null = null;
  if (latestReport) {
    report = new ReportResult(latestReport);
  }
  const historyData = await selectReports(project.id);
  //console.log("HIST", historyData);
  const payload = { project: project, report: report, history: historyData };
  //console.log("PL", payload);
  ctx.body = payload;
  ctx.status = 200;
  ctx.type = 'application/json';
});

router.get('/api/run_analysis', async (ctx) => {
  const report = await api.analyzeProject(project.path, (m: any) => {
    wsMsg(JSON.stringify(m))
    //console.log("P:", m)
  });
  if (Number.isNaN(report.totalFilesBlackProcessed)) {
    report.totalFilesBlackProcessed = 0
  }
  //console.log("Inserting report for", project.id);
  let latestReport = await selectLatestReport(project.id);
  if (latestReport) {
    /* console.log("S", latestReport.score, report.score);
    console.log("F", latestReport.formattingScore, report.formattingScore);
    console.log("C", latestReport.codestyleScore, report.codestyleScore);
    console.log("T", latestReport.typingScore, report.typingScore);*/
    if (latestReport.score == report.score && latestReport.formattingScore == report.formattingScore && latestReport.codestyleScore == report.codestyleScore && latestReport.typingScore == report.typingScore) {
      // nothing changed since last analysis
      const now = Math.floor(Date.now() / 1000);
      console.log("Updating report for", project.title, "id:", latestReport.id);
      updateTimestamp(latestReport.id, now);
    } else {
      console.log("Inserting report for", project.title);
      insertReport(report, project.id);
    }
  } else {
    console.log("Inserting report for", project.title, project.id);
    insertReport(report, project.id);
  }
  const finalReport = await selectLatestReport(project.id);
  const historyData = await selectReports(project.id);
  ctx.body = { report: new ReportResult(finalReport), history: historyData };
  ctx.status = 200;
  ctx.type = 'application/json';
});

router.get('/api/edit', async (ctx) => {
  const data = ctx.request.query;
  const cmd = decodeURIComponent(`${data["cmd"]}`);
  console.log("Opening", cmd);
  api.openInEditor(cmd);
  ctx.status = 204;
  ctx.type = 'application/json';
});

/*router.get('/api/open', async (ctx) => {
  const latestReport = await selectLatestReport(project.id);
  let report: ReportResult | null = null;
  if (latestReport) {
    report = new ReportResult(latestReport);
  }
  //console.log("LATEST", report)
  const payload = { project: project, report: report };
  //console.log(payload);
  ctx.body = payload;
  ctx.status = 200;
  ctx.type = 'application/json';
});*/

router.all('(.*)', async (ctx) => {
  ctx.status = 404;
  ctx.body = await fs.promises.readFile(path.join(__dirname, '../ui/index.html'), 'utf8');
});

export { router }