# deno-template

Template repo for Deno projects 🦕

## Contents

- [Features](#features)
- [VS Code](#vs-code)
  - [Debugging](#debugging)
  - [Unstable](#unstable)
- [Deno Deploy](#deno-deploy)
  - [GitHub Actions](#github-actions)

## Features

- [x] Dev Container and Dockerfile
- [x] VS Code workspace settings and launch configuration
- [x] Starter web app that can be deployed directly to Deno Deploy

## VS Code

If you get an error about uncached dependencies, there is a Quick Fix Action to cache the dependencies for you.

For [twind-intellisense](https://marketplace.visualstudio.com/items?itemName=sastan.twind-intellisense) to work, you have to have the [`twind.config.ts`](./twind.config.ts) file in your workspace root.

If you use [htm](https://github.com/developit/htm) (tagged template literals), install the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) extension.

### Debugging

Run the `debug` launch configuration to run the debugger: <kbd>Shift</kbd> + <kbd>Command</kbd> + <kbd>D</kbd>

This should open <http://localhost:8000> in your browser. You can then open DevTools: <kbd>Option</kbd> + <kbd>Command</kbd> + <kbd>I</kbd>

Now click Node.js DevTools (the green Node logo), set your breakpoints in the _Sources_ tab, and refresh the page.

### Unstable

> ⚠️ **Warning:** There is no equivalent of an `--unstable` flag on Deno Deploy.

If you want to use unstable [Runtime APIs](https://deno.land/api?unstable), add `"deno.unstable": true` to [`settings.json`](./.vscode/settings.json).

You'll also need to add the `--unstable` flag to your `deno run` commands.

## Deno Deploy

This folder can be deployed as-is without a repo to Deno Deploy using the `deployctl` CLI.

To install `deployctl` run:

```bash
deno install -A --no-check https://deno.land/x/deploy/deployctl.ts
```

You can use `--exclude` to ignore files and folders or `--include` to only upload the files you list.

```bash
# need this to exist
export DENO_DEPLOY_TOKEN=ddp_your_token

# last arg is the entrypoint of the application
deployctl deploy --project=your_project --exclude=README.md,LICENSE main.tsx

# deploy a single file bundle (recommended)
deno bundle main.tsx main.bundle.js
deployctl deploy --project=your_project --include=main.bundle.js main.bundle.js
```

### GitHub Actions

See [_deployctl GitHub Action_](https://deno.com/deploy/docs/deployctl#deployctl-github-action) in the Deno Deploy docs. Also see [the Astro docs](https://docs.astro.build/en/guides/deploy/deno/#github-actions-deployment) as they support deployment to Deno via GitHub Actions as well.
