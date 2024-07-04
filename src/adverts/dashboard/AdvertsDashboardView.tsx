import { FC } from 'react'
import { AdvertsTableView } from './AdvertsTableView'

export const AdvertsDashboardView: FC = () => (
    <AdvertsTableView
        prefix=""
        restrictions={{
            editableByMe: true,
            isArchived: false,
        }}
    />
)
