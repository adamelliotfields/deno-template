# deno-template

Template repo for Deno projects 🦕

## Features

- [x] ☁️ **Codespace:** Ubuntu, Deno, SSH, port forwarding
- [x] 💻 **VS Code:** Deno, Copilot, Twind

## Contents

- [VS Code](#vs-code)
  - [Copilot](#copilot)
  - [Unstable](#unstable)
- [Deno Deploy](#deno-deploy)

## VS Code

If you get an error about uncached dependencies, there is a Quick Fix Action to cache the dependencies for you.

For [twind-intellisense](https://marketplace.visualstudio.com/items?itemName=sastan.twind-intellisense) to work, you have to have a `twind.config.ts` in your workspace root. This file can be empty, it just has to exist.

If you use [htm](https://github.com/developit/htm), install [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html).

### Copilot

To remove Copilot, just remove it from [`./.devcontainer.json`](./.devcontainer.json) and [`./.vscode/settings.json`](./.vscode/settings.json).

### Unstable

If you want to use unstable [Runtime APIs](https://deno.land/api?unstable), add `"deno.unstable": true` to `settings.json`.

You'll also need to add the `--unstable` flag to your `deno run` commands.

## Deno Deploy

To install `deployctl` run:

```bash
deno install -A --no-check https://deno.land/x/deploy/deployctl.ts
```

You can use `--exclude` to ignore files and folders or `--include` to only upload the files you list.

```bash
# need this to exist
export DENO_DEPLOY_TOKEN=ddp_your_token

# last arg is the entrypoint of the application
deployctl deploy --project=my_new_project --exclude=README.md,LICENSE.md main.ts

# deploy a single file bundle
deployctl deploy --project=my_new_project --include=main.bundle.js main.bundle.js
```
