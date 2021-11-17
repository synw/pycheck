import chalk from 'chalk';

const flakeIgnore = [
  ".svn",
  "CVS",
  ".bzr",
  ".hg",
  ".git",
  "bin",
  "__pycache__",
  ".tox",
  "*site-packages*",
  ".venv",
  ".env",
  ".envs",
  "*migrations*",
  "node_modules",
];

const colors: Record<string, chalk.Chalk> = {
  c50: chalk.red,
  c69: chalk.hex("#F59E0B"),
  c70: chalk.hex("##FDE68A"),
  c90: chalk.hex("#A7F3D0"),
  c100: chalk.hex("#059669")
}

const libDir = __dirname;

export { flakeIgnore, colors, libDir }