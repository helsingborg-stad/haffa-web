import Koa from 'koa'
import { splitBase64DataUri } from './split-base64-data-uri'
import { HtmlOptions } from './types'
import { getHtmlOptions } from './get-html-options'

export const tryServeImageFromHtmlOptions = (
    getOption: (options: HtmlOptions) => string
): Koa.Middleware => {
    return async (ctx, next) => {
        const possibleDataUrl = getOption(await getHtmlOptions())
        const dataUri = splitBase64DataUri(possibleDataUrl)
        if (dataUri) {
            ctx.set('Content-Type', dataUri.mimeType)
            ctx.body = dataUri.buffer
            return
        }
        return next()
    }
}
