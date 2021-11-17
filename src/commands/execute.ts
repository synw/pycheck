'use strict';
const util = require('util');
const _exec = util.promisify(require('child_process').exec);

export default async function execute(
  cmd: string,
  { onError = (err: any): void => { throw err },
    onStdErr = (err: any): void => { }
  } = {
      onError: (err: any): void => { throw err },
      onStdErr: (err: any): void => { }
    },
): Promise<Array<string>> {
  let res: Array<string> = [];
  try {
    const { stdout, stderr } = await _exec(cmd);
    if (stderr) {
      //console.log("STDERR", stderr)
      onStdErr(stderr);
      return res;
    }
    if (stdout) {
      res = stdout.split("\n")
    }
  } catch (e) {
    // console.log("CMD ERR")
    onError(e)
  }
  return res;
}