import { FC } from 'react'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

export const AdvertsView: FC = () => (
    <AdvertsListWithSearch
        showMonitorNewAds
        cacheName="adverts"
        defaultSearchParams={{
            restrictions: { canBeReserved: true },
            sorting: { field: 'createdAt', ascending: false },
        }}
    />
)
