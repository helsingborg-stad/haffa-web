import Koa from 'koa'
import { Application, ApplicationState } from '../types'
import { get } from './router'

export const createApplication = (): Application => {
    const app = new Koa()

    const state: ApplicationState = {
        app,
        get: (path, mv) => app.use(get(path, mv)),
    }
    return {
        use(module) {
            module(state)
            return this
        },
        listen(port) {
            return app.listen(port, () =>
                console.log(`Haffa web client backend running on port ${port}`)
            )
        },
    }
}
