# cli-test-unit

[![Build Status](https://travis-ci.org/dojo/cli-test-unit.svg?branch=master)](https://travis-ci.org/dojo/cli-test-unit)
[![Build status](https://ci.appveyor.com/api/projects/status/nbgg2yf7hepsvvn2/branch/master?svg=true)](https://ci.appveyor.com/project/Dojo/cli-test-unit/branch/master)
[![codecov](https://codecov.io/gh/dojo/cli-test-unit/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/cli-test-unit)
[![npm version](https://badge.fury.io/js/%40dojo%2Fcli-test-unit.svg)](https://badge.fury.io/js/%40dojo%2Fcli-test-unit)

The official Dojo unit test command. This package uses Intern to run unit tests against your Dojo project.

## Usage

### Prerequisites

This project is a command for the [Dojo CLI]. Please visit the Dojo CLI project for information about the project and how to install.

### Installation

The use `@dojo/cli-test-unit` in a project, install the package:

```bash
npm install @dojo/cli-test-unit
```

### Basic Usage

```bash
dojo test unit
```

### Watching Tests

When running the unit tests in watch mode, the test command will re-run any time a file in your project's `src` or `test` directory changes.

```bash
dojo test unit --watch
```

## How do I contribute?

We appreciate your interest!  Please see the [Dojo Meta Repository](https://github.com/dojo/meta#readme) for the Contributing Guidelines.

### Code Style

This repository uses [`prettier`](https://prettier.io/) for code styling rules and formatting. A pre-commit hook is installed automatically and configured to run `prettier` against all staged files as per the configuration in the projects `package.json`.

An additional npm script to run `prettier` (with write set to `true`) against all `src` and `test` project files is available by running:

```bash
npm run prettier
```

## Testing

Test cases MUST be written using [Intern] using the "bdd" test interface and "assert" assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by Istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`npm test`

© 2018 [JS Foundation] & contributors. [New BSD](LICENSE) license.

[Dojo CLI]: https://github.com/dojo/cli
[Intern]: https://theintern.io/
[JS Foundation]: https://js.foundation/
