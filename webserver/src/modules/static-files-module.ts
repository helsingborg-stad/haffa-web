import serve from 'koa-static'
import { ApplicationModule } from '../types'
export const staticFilesModule: ApplicationModule = ({ app }) =>
    app.use(serve('./build'))
