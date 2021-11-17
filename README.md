# Pycheck

An opinionated code quality checker for Python. Pycheck runs some code checking
tools, shows the problems and generates a note for the code. Checks:

- **Formating** with Black
- **Codestyle** with Flake8
- **Typing** with Pyright

## Install

**Requirements**: to have the base tools installed: [Black](https://pypi.org/project/black/), 
[Flake8](https://pypi.org/project/flake8/) and [Pyright](https://pypi.org/project/pyright/):

```bash
# install the python packages
pip install black flake8 pyright
# clone
git clone git@git.emencia.net:greg/pycheck.git
```

Install Pycheck:

```bash
yarn global add pycheck
# or 
npm install -g pycheck
```

This way you can run `pycheck` in any project directory

## Run

To run Pycheck vs any python directory:

```bash
pycheck /my/python/dir
```

With no parameters it will run in the current directory, looking for python code

Available options:

- `-s`: display suggestions about how to resolve the problems
- `-v`: will display more info (the list of files to format)
- `--debug`: print the commands

## Presets

Some presets options are available for the level of checks:

- `--untyped`: to run with permissive type checking
- `--django`: to run for a Django project

Example with options:

```
pycheck -s --untyped /my/python/dir
```

## Run in dev mode

Install the requirements: 

```
yarn add --global typescript ts-node
```

Cd in the directory and install the dependencies:

```
yarn install
```

Run:

```
yarn dev /my/python/dir
```