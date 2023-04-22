import { execute } from "./execute";
import { flakeIgnore } from "../const";

async function lsl(dirpath: string): Promise<Record<string, Set<string>>> {
  const lines = await execute(`ls -l ${dirpath}`);
  //console.log("LSL res", lines.length, lines)
  const files = new Set<string>();
  const dirs = new Set<string>();
  lines.forEach((item) => {
    if (item.startsWith("d")) {
      const n = item.split(" ").slice(-1)[0];
      if (!flakeIgnore.includes(n)) {
        dirs.add(n)
      }
    } else if (item.startsWith("-")) {
      files.add(item.split(" ").slice(-1)[0])
    }
  });
  return { dirs: dirs, files: files }
}

async function findPackages(dirpath: string, dircontent: Set<string>): Promise<Set<string>> {
  const packages = new Set<string>();
  for (const dirname of dircontent) {
    const { files } = await lsl(dirpath + dirname);
    // console.log("Files in", dirname, files)
    if (files.has("__init__.py")) {
      //console.log(dirname, "has init")
      packages.add(dirname);
      continue
    }
  }
  return packages;
}

/*async function ls(dirname: string = "."): Promise<Set<string>> {
  const lines = await execute(`ls ${dirname}`);
  return new Set<string>(lines)
}*/

export { lsl, findPackages };