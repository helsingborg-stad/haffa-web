import { FC } from 'react'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

export const MyReservationsView: FC = () => (
    <AdvertsListWithSearch
        cacheName="my-reservations"
        defaultSearchParams={{
            restrictions: {
                reservedByMe: true,
            },
            sorting: { field: 'createdAt', ascending: false },
        }}
    />
)
