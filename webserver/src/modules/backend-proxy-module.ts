import proxy from 'koa-proxies'
import { getConfig } from '../config'
import { ApplicationModule } from '../types'

export const backendProxyModule: ApplicationModule = ({ app }) => {
    const target = getConfig().mapBackendUrl('/').replace(/\/$/, '') // remove traling slash
    if (target) {
        console.log(`proxying /api to ${target}`)
        return app.use(
            proxy('/api', {
                target,
            })
        )
    }
}
