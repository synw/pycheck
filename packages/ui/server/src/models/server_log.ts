export default class ServerLogLine {
  raw: string;
  text: string = "";
  method: string = "";
  url: string = "";
  status: number = 0;
  isStatic: boolean = false;

  constructor(raw: string) {
    this.raw = raw;
    if (raw.startsWith("[")) {
      const l = raw.split("]")[1];
      const r = l.match(new RegExp(/"[^"]*"/, "g"));
      if (r) {
        const s = r.toString();
        const l1 = l.replace(s + " ", "").split(" ");
        //console.log("L1", l1);
        this.status = parseInt(l1[1]);
        const urlL = s.replace('"', "").split(" ");
        //console.log(urlL);
        this.method = urlL[0];
        this.url = urlL[1];
        this.isStatic = this.url.startsWith("/static") || this.url == "/favicon.ico"
      }
    } else {
      this.text = raw;
    }
  }

  get isTextLine(): boolean {
    return this.text.length > 0;
  }
}