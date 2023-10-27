import { UrlParamsMapper } from './types'

export const createDefaultUrlParamsMapper = (): UrlParamsMapper => ({
    getUrlParams: () => (window.location.hash || '').substring(1),
    setUrlParams: (p: string) =>
        window.history.replaceState(undefined, '', `#${p}`),
})
