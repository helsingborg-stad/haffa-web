import { FC } from 'react'
import { AdvertsTableView } from './AdvertsTableView'

export const AdvertsDashboardView: FC = () => (
    <AdvertsTableView
        prefix="a"
        restrictions={{
            editableByMe: true,
            canBeReserved: true,
            isArchived: false,
        }}
    />
)
