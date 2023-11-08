import { AdvertFilterInput } from 'adverts'
import { AdvertFilterSortableFieldDescriptor } from 'hard-coded-config/types'
import { AdvertSubscriptionFilter } from 'subscriptions/types'

export interface UrlParamsAdapter {
    parseUrlParams: (prefix: string) => Record<string, string>
    makeUrlParams: (
        prefix: string,
        patch: Record<string, string | number | null | undefined>
    ) => string
    updateLocationWithUrlParams: (
        prefix: string,
        patch: Record<string, string | number | null | undefined>
    ) => void
}

export interface UrlParamsMapper {
    getUrlParams: () => string
    setUrlParams: (p: string) => void
}

export interface UrlParamsContextType extends UrlParamsAdapter {
    patchAdvertFilterInputFromUrl: (
        prefix: string,
        filter: AdvertFilterInput,
        config: {
            sortableFields: AdvertFilterSortableFieldDescriptor[]
        }
    ) => AdvertFilterInput
    updateUrlFromAdvertFilterInput: (
        prefix: string,
        filter: AdvertFilterInput,
        config: {
            sortableFields: AdvertFilterSortableFieldDescriptor[]
        }
    ) => void
    makeAdvertSubscriptionUrl: (
        basePath: string,
        filter: AdvertSubscriptionFilter
    ) => string
}
