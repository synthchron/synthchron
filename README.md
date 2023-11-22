# Synthchron

Synthetic log generator for Petri Nets process models. The project has a web-version and can be installed as a desktop application (using Tauri framework).

The system comprises of the following components:

1. A graph editor for Petri Nets process models
2. Import and export of process models
3. Real-time collaboration on the graph editor project (using Yjs and peer-to-peer connection)
4. A comprehensive log generator with a variety of parameters. The log is exported in XES format, which is the standard format for process models logs.
5. Batch Processing of many projects with the same processing configurations.
6. Post-processing of process models logs, to add noise.

## Setup

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)
- For the [Tauri](https://tauri.studio/en/) project, also follow the [setup instructions](https://tauri.studio/en/docs/getting-started/intro)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/synthchron/synthchron
```

2. Go to the 'synthchron' folder
3. Install dependencies:

```bash
yarn 
```

### Build

1. Go to the 'synthchron' folder and run:

```bash
turbo build
```

You will find the system-specific compiled binaries in the `packages/synthchron/src-tauri/target/release/bundle` folder.

## Run

1. Go to the 'packages/synthchron-tauri' folder2
2. Run `yarn` to install dependencies
3. You can build the project:
   - Web version: `yarn build`
   - Tauri version: `yarn tauri build`
4. You can run the editor:
   - Web version: `yarn dev`
   - Tauri version: `yarn tauri dev`
5. You can run the storybook
   - `yarn storybook`