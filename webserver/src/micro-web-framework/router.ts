import Koa from 'koa'
import { match } from 'path-to-regexp'

export const verb = (
    method: string,
    path: string,
    mv: Koa.Middleware
): Koa.Middleware => {
    const matcher = match(path, { decode: decodeURIComponent })
    return (ctx, next) => {
        const m = ctx.method.toLowerCase() === method && matcher(ctx.path)
        if (m) {
            ctx.params = m.params
            return mv(ctx, next)
        }

        return next()
    }
}

export const get = (path: string, mv: Koa.Middleware): Koa.Middleware =>
    verb('get', path, mv)
