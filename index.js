/************************************************
 *
 * Simple server for serving
 * - static react assets (i.e the application)
 * - api requests to proxied backend
 *
 ***********************************************/

require('dotenv').config()
const Koa = require('koa')
const send = require('koa-send')
const serve = require('koa-static')
const proxy = require('koa-proxies')
const path = require('path')

const PORT = process.env.PORT ?? 3000
const backendUrl = process.env.HAFFA_BACKEND_URL
const app = new Koa()

app.use(serve('./build'))

if (backendUrl) {
  app.use(
    proxy('/api', {
      target: backendUrl,
    })
  )
}

// Catch all to compensate for react-router-dom routing
// see https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
app.use(async (ctx) => send(ctx, path.join('.', 'build', 'index.html')))

app.listen(PORT, () => console.log(`Haffa web running on port ${PORT}`))
