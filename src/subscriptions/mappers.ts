import { AdvertFilterInput } from 'adverts'
import { AdvertSubscriptionFilter } from './types'

export const convertAdvertFilterToSubscriptionFilter = (
    filter: AdvertFilterInput
): AdvertSubscriptionFilter => ({
    search: filter.search,
    categories: filter.fields?.category?.in || [],
})
