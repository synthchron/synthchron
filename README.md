# Synthchron
A synthetic eventlog generator

## Setup

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)

- For the [Tauri](https://tauri.studio/en/) project, also follow the [setup instructions](https://tauri.studio/en/docs/getting-started/intro)
- And download [Rust](https://www.rust-lang.org)

### Installation

```bash
yarn 
```

### Build

```bash
turbo build
```

To build the application as a tauri app run:

```bash
yarn turbo build:tauri
```

You will find the system-specific compiled binaries in the `packages/synthchron/src-tauri/target/release/bundle` folder.
