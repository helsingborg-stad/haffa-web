const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
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
