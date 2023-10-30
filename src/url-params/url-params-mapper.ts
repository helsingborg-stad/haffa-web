import { UrlParamsMapper } from './types'

export const createDefaultUrlParamsMapper = (): UrlParamsMapper => ({
    getUrlParams: () => (window.location.hash || '').substring(1),
    setUrlParams: (p: string) => {
        const {
            location: { hash },
        } = window
        if (p === '' && (hash === '' || hash === '#')) {
            return
        }
        window.history.replaceState(undefined, '', `#${p}`)
    },
})
