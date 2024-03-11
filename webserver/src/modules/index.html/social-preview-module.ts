import { getConfig } from '../../config'
import { ApplicationModule } from '../../types'
import { renderIndexHtmlWithOptions } from './lib/serve-index-html'
import { HtmlOptions, HtmlPreviewOptions } from './types'

const previewKeys = new Set<keyof HtmlPreviewOptions>([
    'title',
    'description',
    'imageUrl',
])

export const socialPreviewModule: ApplicationModule = ({ get }) =>
    get('/advert/:advertId', async (ctx, next) => {
        const {
            params: { advertId },
        } = ctx
        const preview = await fetch(
            getConfig().mapBackendUrl(
                `/api/v1/haffa/social-preview/advert/${advertId}`
            ),
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }
        )
            .then((response) =>
                response.status === 200 ? response.json() : null
            )
            .then((o) =>
                o
                    ? (Object.fromEntries(
                          Object.entries(o).filter(
                              ([key, v]) =>
                                  previewKeys.has(
                                      key as keyof HtmlPreviewOptions
                                  ) &&
                                  typeof v === 'string' &&
                                  v.trim().length > 0
                          )
                      ) as unknown as HtmlPreviewOptions)
                    : undefined
            )
        if (preview) {
            ctx.type = 'text/html'
            ctx.body = await renderIndexHtmlWithOptions({
                preview,
                url: `/advert/${advertId}`,
            })
            return
        }
        return next()
    })
