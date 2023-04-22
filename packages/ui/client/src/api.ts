import { useApi } from "restmix";
import { PyProject, PyCheckReport, PyCheckHistoryReport } from "@/interfaces";
import { state, analyze, editorPath, updateHistory } from "./state";

const api = useApi({
  "serverUrl": "http://localhost:5143"
});

async function init(): Promise<{ project: PyProject, report: PyCheckReport, history: Array<PyCheckHistoryReport> }> {
  const res = await api.get<{ project: PyProject, report: PyCheckReport, history: Array<PyCheckHistoryReport> }>("/api/init");
  if (res.ok) {
    return res.data
  }
  throw new Error(`Error ${res.status} ${res}`)
}

async function runAnalysis() {
  analyze.init();
  const res = await api.get<{ report: PyCheckReport, history: Array<PyCheckHistoryReport> }>("/api/run_analysis");
  //console.log("RES", res)
  if (res.ok) {
    state.report = res.data.report;
    analyze.setStep({ step: 3 });
    //console.log(state.report.lastRun, "//", state.report.timestamp)
    analyze.process(state.report);
    updateHistory(res.data.history);
    analyze.state.isAnalyzing = false;
    return
  }
  throw new Error(`Error ${res.status} ${res}`)
}

async function openFile(file: string, line: number) {
  console.log("Open", file);
  const cmd = editorPath.value.replace("{filepath}", file).replace("{line}", line.toString());
  const res = await api.get(`/api/edit?cmd=${cmd}`);
  //console.log(res)
}

export { init, runAnalysis, openFile }