import { createContext } from 'react'
import { createUrlParamsAdapter } from './url-params-adapter'
import { createDefaultUrlParamsMapper } from './url-params-mapper'
import { UrlParamsAdapter, UrlParamsContextType } from './types'

const encode = (arr?: string[]): string[] | undefined =>
    arr?.map((v) => encodeURIComponent(v))

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
            .map((s) => decodeURIComponent(s))
            .filter((v) => v)
        const tags = (params.tags || '')
            .split(',')
            .map((s) => s.trim())
            .map((s) => decodeURIComponent(s))
            .filter((v) => v)
        const size = (params.size || '')
            .split(',')
            .map((s) => s.trim())
            .map((s) => decodeURIComponent(s))
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
                size: size.length ? { in: size } : undefined,
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
            c: encode(filter.fields?.category?.in)?.join(','),
            tags: encode(filter.fields?.tags?.in)?.join(','),
            size: encode(filter.fields?.size?.in)?.join(','),
            p: filter.paging?.pageIndex,
        })
    },
    makeAdvertSubscriptionUrl: (basePath, filter) =>
        `${basePath}#${adapter.makeUrlParams('', {
            s: filter.search,
            c: encode(filter.categories)?.join(','),
            tags: encode(filter.tags)?.join(','),
            size: encode(filter.size)?.join(','),
        })}`,
})

export const UrlParamsContext = createContext<UrlParamsContextType>(
    createUrlParamsContext(
        createUrlParamsAdapter(createDefaultUrlParamsMapper())
    )
)
