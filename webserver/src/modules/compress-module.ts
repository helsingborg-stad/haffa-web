import compress from 'koa-compress'
import { ApplicationModule } from '../types'

export const compressModule: ApplicationModule = ({ app }) =>
    app.use(
        compress({
            filter(content_type) {
                return /text|json|javascript|css|xml/i.test(content_type)
            },
            threshold: 2048,
            gzip: {
                flush: require('zlib').constants.Z_SYNC_FLUSH,
            },
            deflate: {
                flush: require('zlib').constants.Z_SYNC_FLUSH,
            },
            br: false,
        })
    )
