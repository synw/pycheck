import sqlite3 from 'sqlite3';

let db: sqlite3.Database;

function initDb(path: string) {
  db = new sqlite3.Database(path);
  db.run(`
  CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`);
  db.run(`
CREATE TABLE IF NOT EXISTS report (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  files JSON,
  formattingScore INTEGER NOT NULL,
  codestyleScore INTEGER NOT NULL,
  typingScore INTEGER NOT NULL,
  score INTEGER NOT NULL,
  formattingScorePercent INTEGER NOT NULL,
  codestyleScorePercent INTEGER NOT NULL,
  typingScorePercent INTEGER NOT NULL,
  totalFilesBlackProcessed INTEGER NOT NULL,
  numBlackViolations INTEGER NOT NULL,
  disableTyping INTEGER NOT NULL CHECK (disableTyping IN (0, 1)),
  hasProblems INTEGER NOT NULL CHECK (hasProblems IN (0, 1)),
  hasMajorProblems INTEGER NOT NULL CHECK (hasMajorProblems IN (0, 1)),
  timestamp INTEGER NOT NULL,
  date TEXT NOT NULL,
  lastRun INTEGER NOT NULL,
  lastRunDate TEXT NOT NULL,
  project_id INTEGER NOT NULL,
  FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
)
`);
}

export { db, initDb }