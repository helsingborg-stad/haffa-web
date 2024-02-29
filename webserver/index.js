/************************************************
 *
 * Simple server for serving
 * - static react assets (i.e the application)
 * - api requests to proxied backend
 *
 ***********************************************/

require('dotenv').config()
const Koa = require('koa')
const compress = require('koa-compress')
const Router = require('@koa/router')
const serve = require('koa-static')
const proxy = require('koa-proxies')
const { join } = require('path')
const { readFile } = require('fs/promises')
const { generateHtml, fetchBinaryImage } = require('./html')
const { readFileSync } = require('fs')
const PORT = process.env.PORT ?? 3000
const backendUrl = process.env.HAFFA_BACKEND_URL
const app = new Koa()
const router = new Router()

const PATTERN_INDEX = /\/index.html$|\/$/
const PATTERN_IMAGE = /\/(image-\w+).png$/

/************************************************************
 *
 * Load html source into context
 *
 ***********************************************************/
app.context.htmlSource = readFileSync(
    join(process.cwd(), '/build/index.html'),
    {
        encoding: 'utf8',
    }
)

/************************************************************
 *
 * Compress large files
 *
 ***********************************************************/
app.use(
    compress({
        filter(content_type) {
            return /text|json|javascript|css|xml/i.test(content_type)
        },
        threshold: 2048,
        gzip: {
            flush: require('zlib').constants.Z_SYNC_FLUSH,
        },
        deflate: {
            flush: require('zlib').constants.Z_SYNC_FLUSH,
        },
        br: false,
    })
)

/************************************************************
 *
 * Proxy requests to backend
 *
 ***********************************************************/
if (backendUrl) {
    app.use(
        proxy('/api', {
            target: backendUrl,
        })
    )
}

/************************************************************
 *
 * Annotate every response with Git revision
 *
 ***********************************************************/
const revision = readFile(join(process.cwd(), 'git_revision.txt'), {
    encoding: 'utf8',
})
    .then(
        (text) =>
            (text || '')
                .split('\n')
                .map((v) => v.trim())
                .filter((v) => v)[0] || ''
    )
    .catch(() => '')

app.use(async (ctx, next) => {
    const r = await revision
    r && ctx.set('x-git-rev', r)
    return next()
})

// Generate index.html
app.use(async (ctx, next) => {
    if (PATTERN_INDEX.test(ctx.path)) {
        await generateHtml(ctx.htmlSource).then((cache) => {
            ctx.body = cache.html
        })
    } else {
        return next()
    }
})

// Generate binary images
app.use(async (ctx, next) => {
    const match = ctx.path.match(PATTERN_IMAGE)

    if (match) {
        return await fetchBinaryImage(ctx, match, next)
    } else {
        return next()
    }
})

/************************************************************
 *
 * Serve React app as static files
 *
 ***********************************************************/
app.use(serve('./build'))

/************************************************************
 *
 * Catch all to compensate for react-router-dom routing
 * see https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
 *
 ***********************************************************/
router.get('/:path*', async (ctx) => {
    await generateHtml(ctx.htmlSource).then((cache) => {
        ctx.body = cache.html
    })
})

/************************************************************
 *
 * Register routes and start webserver
 *
 ***********************************************************/
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => console.log(`Haffa web running on port ${PORT}`))
