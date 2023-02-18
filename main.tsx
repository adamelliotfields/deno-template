import { twind, virtual as sheet } from '@twind/core'
import TwindStream from '@twind/with-react/readableStream'

import { Hono, MiddlewareHandler } from 'hono'
import { etag, logger, serveStatic } from 'hono/middleware'

import React from 'react'
import { renderToReadableStream } from 'react-dom/server'

import { serve, type ServeInit } from 'std/http/server'

import config from '~/twind.config.ts'

const DENO_DEPLOYMENT_ID = Deno.env.get('DENO_DEPLOYMENT_ID')

const app = new Hono()
const tw = twind(config, sheet())
const options: ServeInit = {
  onListen({ hostname, port }) {
    const host = hostname === '0.0.0.0' ? 'localhost' : hostname
    // don't log the "Listening on..." message in Deno Deploy
    if (typeof DENO_DEPLOYMENT_ID === 'undefined') {
      console.log(`Listening on http://${host}:${port}`)
    }
  },
}

app.use('*', logger(), etag(), cacheControl())
app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }))
app.get('/', handleApp({ title: 'Home' }))
app.all('*', handleApp({ title: 'Not Found', status: 404 }))

serve(app.fetch, options)

// react will send !doctype to the browser for us
function App({ title }: AppProps) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content={title} />
        <title>{title}</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </head>
      <body className='bg-white dark:bg-black'>
        <div
          id='root'
          className='flex flex-col items-center justify-center w-full h-screen'
          style={{ backgroundImage: 'url(\'/static/background-pattern.svg\')' }}
        >
          <h1 className='text-gray-800 dark:text-gray-200 text-4xl font-bold'>
            {title}
          </h1>
          <p className='mt-2 text-lg text-center text-gray-600 dark:text-gray-400'>
            Develop Locally, Deploy Globally
          </p>
          <footer className='fixed bottom-8 w-full h-6 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300'>
            Powered by
            <a
              className='flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm no-underline font-semibold'
              href='https://deno.com/deploy'
            >
              <img className='w-5' alt='Deno' src='/static/logo.svg' /> Deno Deploy
            </a>
          </footer>
        </div>
      </body>
    </html>
  )
}

// stream the app to the client
function handleApp({ title, status = 200, headers = {} }: AppConfig) {
  return async function () {
    const stream = await renderToReadableStream(<App title={title} />)
    // @ts-ignore: weird
    const transform = new TwindStream(tw)
    const app = stream.pipeThrough(transform)
    return new Response(app, {
      status,
      headers: { 'content-type': 'text/html; charset=utf-8', ...headers },
    })
  }
}

// cache control middleware
function cacheControl(header = 'public, max-age=86400'): MiddlewareHandler {
  return async function (c, next) {
    await next()
    c.header(
      'cache-control',
      // don't cache in development
      typeof DENO_DEPLOYMENT_ID === 'undefined' ? 'no-store' : header,
    )
  }
}

interface AppProps {
  title: string
}

interface AppConfig extends AppProps {
  status?: number
  headers?: Record<string, string>
}
