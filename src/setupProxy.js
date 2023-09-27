const { readFile } = require('fs/promises')
const { createProxyMiddleware } = require('http-proxy-middleware')

const tryLoadJson = (path) =>
    readFile(path, { encoding: 'utf-8' })
        .then((text) => JSON.parse(text))
        .catch(() => null)

module.exports = function (app) {
    // Theme/branding managament
    app.use('/branding.json', async (req, res, next) => {
        const theme = await tryLoadJson(process.env.BRANDING_PATH)
        res.send(theme || {})
    })

    // Proxy API requests to backend
    ;[{ path: '/api', target: process.env.HAFFA_BACKEND_URL }]
        .filter(({ path, target }) => path && target)
        .forEach(({ path, target }) =>
            app.use(
                path,
                createProxyMiddleware({
                    target,
                    changeOrigin: true,
                })
            )
        )

    return void 0
}
