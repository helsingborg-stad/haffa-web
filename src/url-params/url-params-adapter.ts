import { toMap } from 'lib/to-map'
import { UrlParamsAdapter, UrlParamsMapper } from './types'

export const createUrlParamsAdapter = (
    mapper: UrlParamsMapper
): UrlParamsAdapter => {
    const parseUrlParams: UrlParamsAdapter['parseUrlParams'] = (prefix) =>
        toMap(
            [...new URLSearchParams(mapper.getUrlParams()).entries()].filter(
                ([key]) => key.startsWith(prefix)
            ),
            ([key]) => key.substring(prefix.length),
            ([_, value]) => value
        )

    const makeUrlParams: UrlParamsAdapter['makeUrlParams'] = (prefix, patch) =>
        Object.entries(patch || {})
            .reduce((s, [key, value]) => {
                value
                    ? s.set(prefix + key, value.toString())
                    : s.delete(prefix + key)
                return s
            }, new URLSearchParams(mapper.getUrlParams()))
            .toString()

    const patchUrlParams: UrlParamsAdapter['updateLocationWithUrlParams'] = (
        prefix,
        patch
    ) => {
        mapper.setUrlParams(makeUrlParams(prefix, patch))
    }

    return {
        parseUrlParams,
        makeUrlParams,
        updateLocationWithUrlParams: patchUrlParams,
    }
}
