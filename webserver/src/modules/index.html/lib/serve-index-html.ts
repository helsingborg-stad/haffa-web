import Koa from 'koa'
import { cached, once } from '../../../utils'
import { readFile } from 'fs/promises'
import { join } from 'path'
import handlebars from 'handlebars'
import { CACHE_TTL_MS } from '../constants'
import { getHtmlOptions } from './get-html-options'

const getTemplate = once(() =>
    readFile(join(process.cwd(), '/build/index.html'), {
        encoding: 'utf8',
    }).then((text) => handlebars.compile(text))
)

const renderIndexHtml = cached(async () => {
    const template = await getTemplate()
    const options = await getHtmlOptions()
    return template(options)
}, CACHE_TTL_MS)

export const serveIndexHtml: Koa.Middleware = async (ctx) => {
    ctx.type = 'text/html'
    ctx.body = await renderIndexHtml()
}
