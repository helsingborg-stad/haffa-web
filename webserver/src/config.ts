interface Config {
    port: string | number
    mapBackendUrl: (path: string) => string
}

const port = process.env.PORT ?? 3000
const backendUrl = (() => {
    const v = process.env.HAFFA_BACKEND_URL
    if (!v) {
        console.warn(
            'HAFFA_BACKEND_URL is not defined. Backend requests will not be proxied'
        )
        return ''
    }
    return v
})()

export const getConfig = (): Config => ({
    port,
    mapBackendUrl: (path) => new URL(path, backendUrl).toString(),
})
