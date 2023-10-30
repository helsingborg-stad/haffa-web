import { createContext } from 'react'
import { createUrlParamsAdapter } from './url-params-adapter'
import { createDefaultUrlParamsMapper } from './url-params-mapper'
import { UrlParamsAdapter, UrlParamsContextType } from './types'

const createUrlParamsContext = (
    adapter: UrlParamsAdapter
): UrlParamsContextType => ({
    ...adapter,
    patchAdvertFilterInputFromUrl: (prefix, filter) => {
        const params = adapter.parseUrlParams(prefix)
        const search = params.s || ''
        const categories = (params.c || '')
            .split(',')
            .map((s) => s.trim())
            .filter((v) => v)
        const page = parseInt(params.p, 10) || 0
        return {
            ...filter,
            search,
            fields: {
                ...filter.fields,
                category: categories.length ? { in: categories } : undefined,
            },
            paging: { pageSize: 25, ...filter.paging, pageIndex: page },
        }
    },
    updateUrlFromAdvertFilterInput: (prefix, filter) => {
        adapter.updateLocationWithUrlParams(prefix, {
            s: filter.search,
            c: filter.fields?.category?.in?.join(','),
            p: filter.paging?.pageIndex,
        })
    },
    makeAdvertSubscriptionUrl: (basePath, filter) =>
        `${basePath}#${adapter.makeUrlParams('', {
            s: filter.search,
            c: filter.categories?.join(','),
        })}`,
})

export const UrlParamsContext = createContext<UrlParamsContextType>(
    createUrlParamsContext(
        createUrlParamsAdapter(createDefaultUrlParamsMapper())
    )
)
