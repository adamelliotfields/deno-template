# deno-template

Template repo for Deno projects 🦕

> NB: only using [`deno_blog`](https://deno.land/x/blog) as a demo, this is **not a blog template**.

## Contents

- [Features](#features)
- [Usage](#usage)
- [VS Code](#vs-code)
  - [Copilot](#copilot)
  - [Unstable](#unstable)
- [Removing Template Files](#removing-template-files)
- [Examples](#examples)
  - [Fresh](#fresh)
  - [Hono](#hono)

## Features

- [x] ☁️ **Codespace:** _Ubuntu, Deno, SSH, ports 2222 & 8000_
- [x] 💻 **VS Code:** _Deno + Copilot_

## Usage

```bash
# run the blog server in dev mode (port 8000)
deno task dev
```

## VS Code

Deno doesn't have an `npm install` equivalent. You'll use ES Modules hosted on a CDN. When you run your code for the first time, Deno will download and cache all the modules you need. The cache is in your home folder, so it's shared across all your projects (i.e., pnpm).

The Deno VS Code extension uses the same `deno` binary and same cached modules as your code. For example, if you start writing JSX, the extension will error because it doesn't have the appropriate JSX Runtime module cached.

Just cache it manually:

```bash
deno cache https://esm.sh/react/jsx-runtime

# or

deno cache https://esm.sh/preact/jsx-runtime
```

Then restart the Deno language server: <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> > `Deno: Restart Language Server` ✌️

### Copilot

To remove Copilot, just remove it from [`./.devcontainer.json`](./.devcontainer.json) and [`./.vscode/settings.json`](./.vscode/settings.json) 👋

### Unstable

If you want to use unstable [Runtime APIs](https://deno.land/api?unstable), add `"deno.unstable": true` to `settings.json`.

You'll also need to add the `--unstable` flag to your `deno run` commands.

## Removing Template Files

If you're planning on using this to make a Deno Blog, then you probably don't need to delete anything.

If you want to make things besides blogs, you'll want to remove a folder, a couple files, and optionally make a few config changes.

```bash
rm -rf posts favicon.ico main.tsx
```

[**`./deno.jsonc`**](./deno.jsonc)

Replace the `dev` task with your own tasks.

```diff
{
  "tasks": {
-   "dev": "deno run -A --watch main.tsx --dev"
  }
}
```

[**`./import_map.json`**](./import_map.json)

If you're building an application, use an [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).

If you're building a library, use [`deps.ts`](https://deno.land/manual/examples/manage_dependencies) instead.

Note that you'll get warnings about redirected imports because I'm not using versions in this template repo. Just add version specifiers, e.g., `https://deno.land/x/blog@0.0.1/blog.tsx`

```diff
{
  "imports": {
-   "blog": "https://deno.land/x/blog/blog.tsx"
  }
}
```

## Examples

### Fresh

It really is the freshest way to build web apps 🍋

You can initialize a new [Fresh](https://fresh.deno.dev) project in an existing folder like this one.

When asked if you use VS Code, respond with <kbd>N</kbd> so our existing settings don't get clobbered.

When the script is done, just replace `deno.jsonc` with the `deno.json` created by Fresh and start the dev server:

```bash
deno run -A -r https://fresh.deno.dev .

mv -f deno.json deno.jsonc

deno task start
```

Open <http://localhost:8000> in your browser 🚀

### Hono

[Hono](https://honojs.dev) is a framework built with Web APIs. It can run in Deno, Bun, Node, etc. It's [very fast](https://github.com/denosaurs/bench#overview).

Just replace `main.tsx` with the following and run it:

<!-- deno-fmt-ignore -->
```typescript
/** @jsx React.createElement */
import { serve } from "https://deno.land/std/http/server.ts";
import { logger } from "https://deno.land/x/hono/middleware.ts";
import { type Context, Hono } from "https://deno.land/x/hono/mod.ts";
import { nanoid } from "https://esm.sh/nanoid";
import React from "https://esm.sh/react";
import { renderToReadableStream } from "https://esm.sh/react-dom/server";

const app = new Hono();
const db = new Map<string, string>();
const log = logger(console.log);

const style = `
*, *::before, *::after {
  box-sizing: border-box;
}
body {
  background-color: black;
  color: chartreuse;
  font-family: sans-serif;
  margin: 0;
}
div {
  display: grid;
  height: 100vh;
}
h1 {
  margin: auto;
}`;

interface AppProps {
  title: string;
}

// react will send !doctype to the browser for us
const App = ({ title }: AppProps) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <style>{style}</style>
    </head>
    <body>
      <div id="root">
        <h1>{title}</h1>
      </div>
    </body>
  </html>
);

// https://beta.reactjs.org/reference/react-dom/server/renderToReadableStream
const handleGet = async () =>
  new Response(
    await renderToReadableStream(<App title="URL Shortener" />),
    { status: 200, headers: { "content-type": "text/html; charset=UTF-8" } },
  );

// curl -X POST http://localhost:8000 -d 'https://example.com'
const handlePost = async (c: Context) => {
  const text = await c.req.text();
  const url = c.req.url;
  const id = nanoid(7);
  db.set(id, text);
  return c.text(`${url}${id}`);
};

// curl -IX GET http://localhost:8000/ZI61Hek
const handleGetById = (c: Context) => {
  const id = c.req.param("id");
  const url = db.get(id);
  return url ? c.redirect(url) : c.notFound();
};

app.use("*", log);
app.get("/", handleGet);
app.post("/", handlePost);
app.get("/:id", handleGetById);

serve(app.fetch);
```
