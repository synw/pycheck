import { reactive } from "vue";
import { analyze, state } from "./state";
import { ServerLogLine } from "@/interfaces";

const stdout = reactive<Array<string>>([]);

const ws = new WebSocket('ws://localhost:5142');
ws.onopen = () => {
  console.log('WebSocket connected');
};
ws.onmessage = (event) => {
  console.log("MSG", event.data)
  if (event.data.toString().startsWith('{"raw":')) {
    const data = event.data;
    const line = JSON.parse(data) as ServerLogLine;
    state.project.serverOutput.push(line)
  } else if (event.data.toString().startsWith('{"step":')) {
    const data = event.data;
    const line = JSON.parse(data) as Record<string, number>;
    analyze.setStep(line);
  } else {
    stdout.push(`${event.data}`);
  }
};
ws.onclose = () => {
  console.log('WebSocket disconnected');
};

function clearPrint() {
  stdout.splice(0, stdout.length);
}

export { stdout, clearPrint }