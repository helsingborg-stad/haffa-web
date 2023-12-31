import { createContext } from 'react'
import { createUrlParamsAdapter } from './url-params-adapter'
import { createDefaultUrlParamsMapper } from './url-params-mapper'
import { UrlParamsAdapter, UrlParamsContextType } from './types'

const createUrlParamsContext = (
    adapter: UrlParamsAdapter
): UrlParamsContextType => ({
    ...adapter,
    patchAdvertFilterInputFromUrl: (prefix, filter, { sortableFields }) => {
        const params = adapter.parseUrlParams(prefix)
        const search = params.s || ''
        const categories = (params.c || '')
            .split(',')
            .map((s) => s.trim())
            .filter((v) => v)
        const tags = (params.t || '')
            .split(',')
            .map((s) => s.trim())
            .filter((v) => v)
        const sorting = params.sf || ''
        const page = parseInt(params.p, 10) || 0
        return {
            ...filter,
            search,
            fields: {
                ...filter.fields,
                category: categories.length ? { in: categories } : undefined,
                tags: tags.length ? { in: tags } : undefined,
            },
            sorting:
                sortableFields.find((sf) => sf.key === sorting)?.sorting ||
                filter.sorting,
            paging: { pageSize: 25, ...filter.paging, pageIndex: page },
        }
    },
    updateUrlFromAdvertFilterInput: (prefix, filter, { sortableFields }) => {
        adapter.updateLocationWithUrlParams(prefix, {
            s: filter.search,
            sf: sortableFields.find(
                ({ sorting }) =>
                    sorting.field === filter.sorting?.field &&
                    sorting.ascending === filter.sorting?.ascending
            )?.key,
            c: filter.fields?.category?.in?.join(','),
            t: filter.fields?.tags?.in?.join(','),
            p: filter.paging?.pageIndex,
        })
    },
    makeAdvertSubscriptionUrl: (basePath, filter) =>
        `${basePath}#${adapter.makeUrlParams('', {
            s: filter.search,
            c: filter.categories?.join(','),
            t: filter.tags?.join(','),
        })}`,
})

export const UrlParamsContext = createContext<UrlParamsContextType>(
    createUrlParamsContext(
        createUrlParamsAdapter(createDefaultUrlParamsMapper())
    )
)
