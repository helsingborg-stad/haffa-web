import { FC } from 'react'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

export const AdvertsView: FC = () => (
    <AdvertsListWithSearch
        showSubscriptionOptions
        scrollTopOnFilterChange
        prefix=""
        defaultSearchParams={{
            restrictions: { canBeReserved: true },
            sorting: { field: 'createdAt', ascending: false },
        }}
    />
)
