import { ApplicationModule } from '../../types'
import { serveIndexHtml } from './serve-index-html'
import { tryServeImageFromHtmlOptions } from './try-serve-image-from-html-options'

export const indexModule: ApplicationModule = ({ get }) => {
    get('/', serveIndexHtml)
    get('/index.html', serveIndexHtml)
}

export const reactCatchAllModule: ApplicationModule = ({ get }) =>
    get('/:path*', serveIndexHtml)

export const indexImagesModule: ApplicationModule = ({ get }) => {
    get(
        '/image-favicon.png',
        tryServeImageFromHtmlOptions((o) => o.imageFavicon)
    )
    get(
        '/image-logo192.png',
        tryServeImageFromHtmlOptions((o) => o.imageLogo192)
    )
    get(
        '/image-logo512.png',
        tryServeImageFromHtmlOptions((o) => o.imageLogo512)
    )
}
