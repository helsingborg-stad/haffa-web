/************************************************
 *
 * Simple server for serving
 * - static react assets (i.e the application)
 * - api requests to proxied backend
 *
 ***********************************************/

require('dotenv').config()
const Koa = require('koa')
const serve = require('koa-static')
const proxy = require('koa-proxies')

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

app.listen(PORT, () => console.log(`Haffa web running on port ${PORT}`))
