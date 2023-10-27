import { useContext, useState } from 'react'
import { UrlParamsContext } from './url-params-context'

export const useUrlParams = <T>(
    prefix: string,
    map: (urlParams: Record<string, string>) => T,
    patch: (v: T) => Record<string, string | number | null | undefined>
): [T, (v: T) => void] => {
    const { parseUrlParams, patchUrlParams } = useContext(UrlParamsContext)
    const [value, setValue] = useState(map(parseUrlParams(prefix)))
    return [
        value,
        (v) => {
            setValue(v)
            patchUrlParams(prefix, patch(v))
        },
    ]
}
