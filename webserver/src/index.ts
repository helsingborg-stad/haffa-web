require('dotenv').config()

import { getConfig } from './config'
import { createApplication } from './micro-web-framework/application'
import {
    backendProxyModule,
    compressModule,
    reactCatchAllModule,
    serveApplicationImagesModule,
    serveIndexHtmlModule,
    staticFilesModule,
} from './modules'

createApplication()
    .use(compressModule)
    .use(backendProxyModule)
    .use(serveApplicationImagesModule)
    .use(serveIndexHtmlModule)
    .use(staticFilesModule)
    .use(reactCatchAllModule)
    .listen(getConfig().port)
