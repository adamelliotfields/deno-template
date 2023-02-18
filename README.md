# deno-template

Template repo for Deno projects 🦕

## Contents

- [Features](#features)
- [VS Code](#vs-code)
  - [Debugging](#debugging)
  - [Unstable](#unstable)
- [Deno Deploy](#deno-deploy)

## Features

- [x] Dev Container and Dockerfile
- [x] VS Code workspace settings and launch configuration
- [x] GitHub Actions for format, lint, type-check, build, and deploy
- [x] Starter web app that can be deployed to Deno Deploy

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

Uncomment the `deploy` job in [`.github/workflows/build.yml`](./github/workflows/build.yml) to deploy to Deno Deploy. Rename the `project` to your project name.

If you want to deploy when a PR is merged to main, use this condition:

```yaml
deploy:
  if: github.event.pull_request.merged == true && github.ref == 'refs/heads/main'
```

If you want to deploy when pushing directly to main, use this condition:

```yaml
deploy:
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

You just have to create a project and enable GitHub Actions for it in the [Deno Deploy Dashboard](https://dash.deno.com).
