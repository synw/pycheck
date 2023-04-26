import { reactive, toRaw } from "vue";
import { useStorage } from '@vueuse/core';
import { User } from "@snowind/state";
import { PyProject, ViewsType, PyCheckReport, ChangeHistory, PyCheckHistoryReport } from "@/interfaces";
import SubViews from '@/packages/tabs/models/subviews';
import AnalysisSubview from '@/views/subviews/AnalysisSubview.vue';
import InfosSubview from '@/views/subviews/InfosSubview.vue';
import StatsView from "@/views/subviews/StatsView.vue";
import { init } from "@/api";
import { AnalyzeProcessor } from "./models/analyze_processor";

const user = new User();
const state = reactive(
  {
    isReady: false,
    project: {} as PyProject,
    report: {} as PyCheckReport,
    history: {} as ChangeHistory,
    rawHistory: new Array<PyCheckHistoryReport>,
  }
);
let analyze = new AnalyzeProcessor();

// settings
const editorPath = useStorage<string>("editorPath", "");

const _views = {
  "Infos": InfosSubview,
  "Analysis": AnalysisSubview,
  "History": StatsView,
};

const subviews = new SubViews<ViewsType>({
  views: _views,
  activeView: "Analysis",
  onViewChange: (v: ViewsType) => { document.title = `${state.project.title} - ${v}` },
});

async function initState() {
  const { project, report, history } = await init();
  state.project = project;
  if (report) {
    state.report = report;
    analyze.process(report);
    analyze.state.analysisStep = { step: 3 };
  }
  updateHistory(history);
  state.isReady = true;
  //console.log(state.project)
}

function updateHistory(history: Array<PyCheckHistoryReport>) {
  state.rawHistory = history;
  const _history: ChangeHistory = {
    formatting: history.map((h) => h.formattingScore),
    codestyle: history.map((h) => h.codestyleScore),
    typing: history.map((h) => h.typingScore),
    score: history.map((h) => h.score),
  }
  state.history = _history;
  if (state.history.formatting.length < 2) {
    subviews.hide("History")
  } else {
    subviews.show("History")
  }
}

export {
  user,
  state,
  editorPath,
  subviews,
  analyze,
  initState,
  updateHistory
}