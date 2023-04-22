import { run } from './execute';

function openFile(
  filepath: string,
  callback: (data: any) => void,
): () => boolean {
  let cmd = '';
  const _args = new Array<string>();
  switch (process.platform) {
    case 'darwin':
      cmd = 'open';
      _args.push('-R');
      break;
    default:
      cmd = 'xdg-open';
  }
  _args.push(filepath)
  return run(cmd, _args, { onStdout: callback })
}

export default openFile 