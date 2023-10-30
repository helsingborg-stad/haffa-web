import { AdvertsListWithSearch } from 'adverts/components/listings/AdvertsListWithSearch'
import { FC } from 'react'

export const SubscriptionView: FC = () => (
    <AdvertsListWithSearch
        showSubscriptionOptions={false}
        prefix=""
        defaultSearchParams={{
            restrictions: { canBeReserved: true },
            sorting: { field: 'createdAt', ascending: false },
        }}
    />
)
