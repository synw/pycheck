import { run } from './execute';

function openInEditor(
  cmdline: string,
  callback: (data: any) => void = (d) => null,
): () => boolean {
  const li = cmdline.split(" ");
  const cmd = li[0];
  const _args = li.slice(1);
  return run(cmd, _args, { onStdout: callback })
}

export default openInEditor 