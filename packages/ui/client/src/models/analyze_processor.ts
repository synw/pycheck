import { computed, reactive } from "vue"
import { PyCheckReport } from "@/interfaces";
import { format } from 'timeago.js';

function convertColor(color: string): string {
  let c = "";
  switch (color) {
    case "light":
      c = "#6b7280"
      break;
    case "success":
      c = "#16a34a"
      break;
    case "warning":
      c = "#f59e0b"
      break;
    case "danger":
      c = "#ef4444"
  }
  return c
}

export class AnalyzeProcessor {
  state = reactive({
    isAnalyzing: false,
    analysisStep: { step: 0 } as Record<string, number>,
  });
  lastRun: Date = new Date();
  firstRun: Date = new Date();
  formattingScore = reactive({ score: 0, color: "light" });
  codestyleScore = reactive({ score: 0, color: "light" });
  typingScore = reactive({ score: 0, color: "light" });

  get lastRunStr(): string {
    //console.log("First run", this.firstRun)
    return format(this.lastRun)
  }

  get lastChangeStr(): string {
    //console.log("Last run", this.lastRun)
    return format(this.firstRun)
  }

  formattingColorCode = computed<string>(() => {
    return convertColor(this.formattingScore.color)
  });

  codestyleColorCode = computed<string>(() => {
    return convertColor(this.codestyleScore.color)
  });

  typingColorCode = computed<string>(() => {
    return convertColor(this.typingScore.color)
  });

  score = computed<number>(() => {
    return this.formattingScore.score + this.codestyleScore.score + this.typingScore.score;
  });

  scoreCss = computed<string>(() => {
    let s = "";
    if (this.score.value <= 50) {
      s = "text-c50";
    } else if (this.score.value <= 69) {
      s = "text-c69";
    } else if (this.score.value <= 75) {
      s = "text-c70";;
    } else if (this.score.value == 100) {
      s = "text-c100";;
    } else {
      s = "text-c90";
    }
    return s
  })

  init() {
    this.formattingScore.score = 0;
    this.codestyleScore.score = 0;
    this.typingScore.score = 0;
    this.setStep({ step: 0 });
    this.state.isAnalyzing = true;
  }

  setStep(step: Record<string, number>) {
    this.state.analysisStep = step;
    console.log("Set step", step);
    switch (step.step) {
      case 1:
        this.processFormatingResults(step.formattingScore);
        break;
      case 2:
        this.processCodestyleResults(step.codestyleScore)
        break;
    }
  }

  process(data: PyCheckReport) {
    //console.log("PPP", data.lastRun, data.timestamp)
    this.lastRun = new Date(data.lastRun * 1000);
    this.firstRun = new Date(data.timestamp * 1000);
    //console.log("SCORE", data)
    this.processFormatingResults(data.formattingScore);
    this.processCodestyleResults(data.codestyleScore);
    this.processTypingResults(data.typingScore);
  }

  processFormatingResults(s: number) {
    this.formattingScore.score = s;
    if (this.formattingScore.score == 10) {
      this.formattingScore.color = "success"
    } else if (this.formattingScore.score < 5) {
      this.formattingScore.color = "danger"
    } else {
      this.formattingScore.color = "warning"
    }
  }

  processCodestyleResults(s: number) {
    this.codestyleScore.score = s;
    if (this.codestyleScore.score == 60) {
      this.codestyleScore.color = "success"
    } else if (this.codestyleScore.score < 20) {
      this.codestyleScore.color = "danger"
    } else {
      this.codestyleScore.color = "warning"
    }
  }

  processTypingResults(s: number) {
    this.typingScore.score = s;
    if (this.typingScore.score == 30) {
      this.typingScore.color = "success"
    } else if (this.codestyleScore.score < 20) {
      this.typingScore.color = "danger"
    } else {
      this.typingScore.color = "warning"
    }
  }
}