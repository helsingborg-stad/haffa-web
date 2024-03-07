import Koa from 'koa'

export interface ApplicationState {
    app: Koa<any, any>
    get: (path: string, mv: Koa.Middleware) => any
}

export interface ApplicationModule {
    (state: ApplicationState): any
}

export interface Application {
    use: (module: ApplicationModule) => Application
    listen: (port: string | number) => any
}
