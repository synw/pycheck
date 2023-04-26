import { reactive } from "vue";
import { analyze, state } from "./state";

const stdout = reactive<Array<string>>([]);

const ws = new WebSocket('ws://localhost:5142');
ws.onopen = () => {
  console.log('WebSocket connected');
};
ws.onmessage = (event) => {
  //console.log("MSG", event.data)
  if (event.data.toString().startsWith('{"step":')) {
    const data = event.data;
    const line = JSON.parse(data) as Record<string, number>;
    analyze.setStep(line);
  } else if (event.data.toString().startsWith('pyright')) {
    const msg = event.data.toString().split(state.project.path).slice(-1)[0]
    analyze.state.typingProgress.push(msg);
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