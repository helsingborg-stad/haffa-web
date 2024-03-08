import { ApplicationModule } from '../../types'
import { tryServeImageFromHtmlOptions } from './lib/try-serve-image-from-html-options'

export const serveApplicationImagesModule: ApplicationModule = ({ get }) => {
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
