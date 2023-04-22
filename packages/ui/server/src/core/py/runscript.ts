import { Options, PythonShell } from 'python-shell';

function runPyScriptSync(
  rsShell: PythonShell,
  pythonPath: string,
  scriptPath: string,
  scriptArgs: Array<string>,
  callback: CallableFunction,
  handleOutputFrom: "msg" | "stderr" = "msg"): PythonShell {
  const _options: Options = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ['-u'],
    args: scriptArgs,
  };
  rsShell = new PythonShell(scriptPath, _options);
  rsShell.on('message', function (message) {
    if (handleOutputFrom == "msg") {
      console.log("MSG", message)
      callback(message);
    }
  });
  rsShell.on('stderr', function (err) {
    console.log("STDERR", err);
    if (handleOutputFrom == "stderr") {
      callback(err);
    } else {
      console.log("ERR", err)
    }
  });
  rsShell.on('pythonError', function (err) {
    console.log("PYERR", `${err.message}, ${err.traceback}`);
  });
  rsShell.end(function (err, code, signal) {
    //console.log("END", code, signal);
  });
  return rsShell;
}

async function runPyScript(
  rsShell: PythonShell,
  pythonPath: string,
  scriptPath: string,
  scriptArgs: Array<string>,
  handleOutputFrom: "msg" | "stderr" = "msg",
  callback?: CallableFunction) {
  const _options: Options = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ['-u'],
    args: scriptArgs,
  };
  let promiseResolve: (value: unknown) => void;
  let promise = new Promise((resolve) => promiseResolve = resolve);
  rsShell = new PythonShell(scriptPath, _options);
  const msgs = new Array<string>();
  function handleLine(msg: string) {
    if (callback) {
      callback(msg);
    }
    msgs.push(msg);
  }
  rsShell.on('message', function (message) {
    if (handleOutputFrom == "msg") {
      handleLine(message);
    }
  });
  rsShell.on('stderr', function (err) {
    console.log("STDERR", err);
    if (handleOutputFrom == "stderr") {
      handleLine(err);
    } else {
      promiseResolve(true);
    }
  });
  rsShell.on('pythonError', function (err) {
    console.log("PYERR", `${err.message}, ${err.traceback}`);
    promiseResolve(true)
  });
  rsShell.end(function (err, code, signal) {
    //console.log("END", code, signal);
    promiseResolve(true);
  });
  if (!callback) {
    await promise;
  }
  return msgs;
}

export { runPyScript, runPyScriptSync };