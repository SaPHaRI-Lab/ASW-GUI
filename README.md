# ASW-GUI

This project is a simple API built with [Express.js](https://expressjs.com/) and
[TypeScript](https://www.typescriptlang.org/), backed by an
[SQLite](https://www.sqlite.org/) database. It provides basic functionality to
interact with items stored in the database and hosts staic pages for the
frontend.

The project is configured with [Prettier](https://github.com/prettier/prettier)
for code formatting. When using [VSCode](https://code.visualstudio.com/),
prettier will automatically format code on file save.

**NOTE: VSCode is highly recommended for this repo.**

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Debugging](#debugging)

## Prerequisites

- [Node.JS](https://nodejs.org/en) (>= v20)

## Installation

1. Clone this repository.
2. Install the dependencies:

```
npm install
```

## Usage

To start the development server, run the following command:

```
npm run dev
```

The server will be running at `http://localhost:3000`. This command uses
[Nodemon](https://github.com/remy/nodemon) to watch for file changes in both the
[src](./src/) and [public](./public/) directories.

## Debugging

This repo is configured to support VSCode Debugging. Two debugging
configurations have been set up:

### Debug Server

This configuration launches the Express server and allows you to step through
the server-side code. Internally, it starts the server using `npm run dev`,
which means that it also reloads the server when files are editied.

### Debug Frontend

This configuration launches Chrome against localhost. Before using this
configuration, make sure the server is running using `npm run dev`.

Once the server is running, you can put breakpoints in the files under the
[public](./public/) directory, then step through them using this debug
configuration.
