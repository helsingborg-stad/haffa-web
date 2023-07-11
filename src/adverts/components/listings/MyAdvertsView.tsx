import { FC } from 'react'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

export const MyAdvertsView: FC = () => (
    <AdvertsListWithSearch
        cacheName="my-adverts"
        defaultSearchParams={{
            restrictions: { createdByMe: true },
            sorting: { field: 'createdAt', ascending: false },
        }}
    />
)
