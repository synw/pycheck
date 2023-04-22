#!/usr/bin/env node
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import { initDb } from "./db/schema";
import cors from '@koa/cors';
import { router } from "./router";
import { execPath, mutateProject, setReady } from './state';
import { argv } from "process";

const app = new Koa();
let dbPath = execPath + "/.pycheck.db";
if (argv.length > 2) {
  for (const arg of argv.slice(2, argv.length)) {
    if (arg.startsWith("-db=")) {
      const _path = arg.split("=")[1];
      if (_path.startsWith("/")) {
        dbPath = _path
      } else {
        dbPath = path.join(execPath, _path);
      }
    }
  }
}
async function init() {
  //console.log("Initializing database");
  initDb(dbPath);
  await mutateProject(execPath);
}

init().then(() => setReady(true));

app.use(cors({
  credentials: true
}));

app.use(serve(path.join(__dirname, './ui')));

app.use(router.routes()).use(router.allowedMethods());

app.listen(5143, () => {
  console.log('Server running on port 5143');
});