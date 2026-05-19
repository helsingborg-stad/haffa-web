import type { AdvertFilterInput } from 'adverts'
import type { AdvertSubscriptionFilter } from './types'

export const convertAdvertFilterToSubscriptionFilter = (
    filter: AdvertFilterInput
): AdvertSubscriptionFilter => ({
    search: filter.search,
    categories: filter.fields?.category?.in || [],
    tags: filter.fields?.tags?.in || [],
    size: filter.fields?.size?.in || [],
})
