import TwindStream from "@twind/with-react/readableStream";
import React from "react";

import { twind, virtual as sheet } from "@twind/core";
import { Hono } from "hono";
import { etag, logger, serveStatic } from "hono/middleware";
import { serve } from "std/http/server";
import { renderToReadableStream } from "react-dom/server";

import config from "@/twind.config.ts";

const app = new Hono();

// configure Twind
const tw = twind(config, sheet());

const headers = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "max-age=0, must-revalidate",
};

app.use("*", logger(), etag());
app.use("/public/*", serveStatic({ root: "./" }));
app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));
app.get("/", handleApp({ title: "Home" }));
app.all("*", handleApp({ title: "Not Found", status: 404 }));

serve(app.fetch, { port: 8000 });

// react will send !doctype to the browser for us
function App({ title }: AppProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={title} />
        <title>{title}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="bg-white dark:bg-black">
        <div
          id="root"
          className="flex flex-col items-center justify-center w-full h-screen"
          style={{ backgroundImage: "url('/public/background-pattern.svg')" }}
        >
          <h1 className="text-gray-800 dark:text-gray-200 text-4xl font-bold">
            {title}
          </h1>
          <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400">
            Develop Locally, Deploy Globally
          </p>
          <footer className="fixed bottom-8 w-full h-6 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            Powered by
            <a
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm no-underline font-semibold"
              href="https://deno.com/deploy"
            >
              <img className="w-5" alt="Deno" src="/public/logo.svg" />{" "}
              Deno Deploy
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}

// stream the app to the client
function handleApp({ title, status = 200 }: AppConfig) {
  return async function () {
    const stream = await renderToReadableStream(<App title={title} />);
    // @ts-ignore: weird
    const transform = new TwindStream(tw);
    const app = stream.pipeThrough(transform);
    return new Response(app, { status, headers });
  };
}

interface AppProps {
  title: string;
}

interface AppConfig extends AppProps {
  status?: number;
}
