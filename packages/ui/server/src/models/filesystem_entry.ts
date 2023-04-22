type FileType = "directory" | "python" | "image" | "db" | "html" | "js" | "ts" | "css" | "unknown";

class FilesystemEntry {
  name: string;
  type: FileType;

  constructor(name: string, isDir = false) {
    this.name = name;
    if (!isDir) {
      this.type = this._scanFilename(name)
    } else {
      this.type = "directory";
    }
  }

  static fromLine(line: string): FilesystemEntry {
    const l = line.split(" ");
    const name = l.slice(-1)[0];
    const t = l[0];
    const isDir = t.startsWith("d");
    return new FilesystemEntry(name, isDir);
  }

  _scanFilename(n: string): FileType {
    let t: FileType = "unknown";
    const e = n.split(".");
    if (e.length <= 1) {
      return t
    }
    const fileEx = e[1];
    if (fileEx == "py") {
      t = "python"
    } else {
      if (fileEx == "js") {
        t = "js"
      } else if (fileEx == "ts") {
        t = "ts"
      }
      else if ([".svg", ".png", ".jpg", ".jpeg"].includes(fileEx)) {
        t = "image"
      } else if (["sqlite", "sqlite3"].includes(fileEx)) {
        t = "db"
      } else if (["css", "scss"].includes(fileEx)) {
        t = "css"
      }
    }
    return t;
  }
}

export { FilesystemEntry }
export type { FileType }