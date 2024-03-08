import { ApplicationModule } from '../../types'
import { serveIndexHtml } from './lib/serve-index-html'

export const reactCatchAllModule: ApplicationModule = ({ get }) =>
    get('/:path*', serveIndexHtml)
