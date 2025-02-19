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
        const parseRestriction = (
            name: string,
            d: boolean | undefined
        ): boolean | undefined =>
            // eslint-disable-next-line no-nested-ternary
            params[name] === '1' ? true : params[name] === '0' ? false : d
        const parseStringArray = (name: string): string[] | undefined =>
            params[name]
                ?.split(',')
                .map((s) => s.trim())
                .map((s) => decodeURIComponent(s))
                .filter((v) => v)

        const search = params.s || ''
        const categories = parseStringArray('c')
        const tags = parseStringArray('tags')
        const size = parseStringArray('size')
        const sorting = params.sf || ''
        const places = parseStringArray('places')
        const pickupLocationTrackingNames = parseStringArray('pltn')
        const page = parseInt(params.p, 10) || 0
        return {
            ...filter,
            search,
            fields: {
                ...filter.fields,
                category: categories ? { in: categories } : undefined,
                tags: tags ? { in: tags } : undefined,
                size: size ? { in: size } : undefined,
            },
            sorting:
                sortableFields.find((sf) => sf.key === sorting)?.sorting ||
                filter.sorting,
            restrictions: {
                ...filter.restrictions,
                isArchived: parseRestriction(
                    'archived',
                    filter.restrictions?.isArchived
                ),
                isPicked: parseRestriction(
                    'picked',
                    filter.restrictions?.isPicked
                ),
                hasCollects: parseRestriction(
                    'collects',
                    filter.restrictions?.hasCollects
                ),
                hasReservations: parseRestriction(
                    'reservations',
                    filter.restrictions?.hasReservations
                ),
                canBeReserved: parseRestriction(
                    'reserveable',
                    filter.restrictions?.canBeReserved
                ),
            },
            paging: { pageSize: 25, ...filter.paging, pageIndex: page },
            workflow: {
                ...filter.workflow,
                pickupLocationTrackingNames,
                places,
            },
        }
    },
    updateUrlFromAdvertFilterInput: (prefix, filter, { sortableFields }) => {
        const mapRestriction = (r?: boolean) =>
            // eslint-disable-next-line no-nested-ternary
            r === true ? '1' : r === false ? '0' : undefined
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
            archived: mapRestriction(filter.restrictions?.isArchived),
            picked: mapRestriction(filter.restrictions?.isPicked),
            collects: mapRestriction(filter.restrictions?.hasCollects),
            reservations: mapRestriction(filter.restrictions?.hasReservations),
            reserveable: mapRestriction(filter.restrictions?.canBeReserved),
            places: encode(filter.workflow?.places)?.join(','),
            pltn: encode(filter.workflow?.pickupLocationTrackingNames)?.join(
                ','
            ),
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
