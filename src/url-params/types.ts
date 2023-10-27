export interface UrlParamsAdapter {
    parseUrlParams: (prefix: string) => Record<string, string>
    patchUrlParams: (
        prefix: string,
        patch: Record<string, string | number | null | undefined>
    ) => void
}

export interface UrlParamsMapper {
    getUrlParams: () => string
    setUrlParams: (p: string) => void
}
