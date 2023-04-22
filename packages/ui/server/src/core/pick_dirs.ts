export default async function pickDirs(): Promise<Array<string>> {
  let res = new Array<string>();
  var promiseResolve: (value: unknown) => void;
  var promise = new Promise((resolve) => promiseResolve = resolve);
  console.log("DIRS Picked")
  await promise;
  return res;
}