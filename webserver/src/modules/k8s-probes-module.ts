import proxy from 'koa-proxies'
import { getConfig } from '../config'
import { ApplicationModule } from '../types'

export const k8sProbesModule: ApplicationModule = ({ app }) => {
	const target = getConfig().mapBackendUrl('/').replace(/\/$/, '') // remove traling slash
	if (target) {
		console.log(`proxying k8s probes to ${target}`)
		return app.use(
			proxy(/\/(healthz|readyz|livez)/, {
				target,
			})
		)
	}
}
