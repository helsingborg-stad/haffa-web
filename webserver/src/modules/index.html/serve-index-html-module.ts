import { ApplicationModule } from '../../types'
import { serveIndexHtml } from './lib/serve-index-html'

export const serveIndexHtmlModule: ApplicationModule = ({ get }) => {
    get('/', serveIndexHtml)
    get('/index.html', serveIndexHtml)
}
