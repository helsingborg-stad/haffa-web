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
import { socialPreviewModule } from './modules/index.html/social-preview-module'
import { k8sProbesModule } from './modules/k8s-probes-module'

createApplication()
    .use(compressModule)
    .use(backendProxyModule)
    .use(k8sProbesModule)
    .use(serveApplicationImagesModule)
    .use(socialPreviewModule)
    .use(serveIndexHtmlModule)
    .use(staticFilesModule)
    .use(reactCatchAllModule)
    .listen(getConfig().port)
