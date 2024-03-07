require('dotenv').config()

import { getConfig } from './config'
import { compressModule } from './modules/compress-module'
import { backendProxyModule } from './modules/backend-proxy-module'
import {
    indexImagesModule,
    indexModule,
    reactCatchAllModule,
} from './modules/index.html/index-module'
import { staticFilesModule } from './modules/static-files-module'
import { createApplication } from './micro-web-framework/application'

createApplication()
    .use(compressModule)
    .use(backendProxyModule)
    .use(indexImagesModule)
    .use(indexModule)
    .use(staticFilesModule)
    .use(reactCatchAllModule)
    .listen(getConfig().port)
