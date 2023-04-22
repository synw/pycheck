import { run } from './execute';

function runMakeCommand(
  dir: string,
  cmd: string,
  callback: (data: any) => void,
  onFinished: () => void,
): () => boolean {
  const _args = [`--directory=${dir}`, cmd];
  return run("make", _args, { onStdout: callback, onFinished: onFinished })
}

export { runMakeCommand }