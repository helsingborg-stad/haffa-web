import { Advert } from 'adverts'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import EditIcon from '@mui/icons-material/Edit'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'
import { AdvertsTableContextType, Column } from './AdvertsTable/types'

export const createLink = (to: string, icon: ReactNode) => (
    <NavLink to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
        {icon}
    </NavLink>
)

export const createColumns = ({
    categoryTree,
}: AdvertsTableContextType): Column<Advert>[] => [
    {
        key: 'title',
        label: 'Titel',
        sortField: 'title',
        getter: ({ title }) => title,
    },
    {
        key: 'category',
        label: 'Kategori',
        getter: ({ category }) =>
            categoryTree
                .pathById(category)
                .map(({ label }) => label)
                .join(' - '),
    },
    {
        key: 'reference',
        label: 'Egen referens',
        sortField: 'reference',
        getter: ({ reference }) => reference,
    },
    {
        key: 'notes',
        label: 'Egna noteringar',
        sortField: 'notes',
        getter: ({ notes }) => notes,
    },
    {
        key: 'isOverdue',
        label: 'Försenad?',
        getter: ({ meta }) => meta.claims.some(({ isOverdue }) => isOverdue),
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ meta: { claims } }) =>
            claims.some(({ isOverdue }) => isOverdue) ? (
                <EventBusyIcon />
            ) : null,
    },
    {
        key: 'visit-link',
        label: '',
        getter: ({ id }) => `/advert/${id}`,
        header: () => null,
        cell: ({ id }) => createLink(`/advert/${id}`, <OpenInBrowserIcon />),
    },
    {
        key: 'edit-link',
        label: '',
        getter: ({ id }) => `/advert/edit/${id}`,
        header: () => null,
        cell: ({ id }) => createLink(`/advert/edit/${id}`, <EditIcon />),
    },
]
