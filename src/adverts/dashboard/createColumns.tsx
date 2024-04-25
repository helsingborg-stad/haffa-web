import { Advert, AdvertImage } from 'adverts'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import EditIcon from '@mui/icons-material/Edit'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'
import { Box } from '@mui/material'
import { AdvertsTableContextType, Column } from './AdvertsTable/types'

export const createLink = (to: string, icon: ReactNode) => (
    <NavLink to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
        {icon}
    </NavLink>
)

export const createAdvertImage = ([image]: AdvertImage[]) => (
    <Box
        component="img"
        src={image?.url ?? '/empty-advert.svg'}
        sx={{
            height: 48,
            width: 48,
            objectFit: 'cover',
        }}
    />
)

const makeColumn = (
    visible: boolean | undefined,
    column: Column<Advert>
): Column<Advert> => ({
    ...column,
    key: visible ? column.key : '',
})
export const createColumns = ({
    categoryTree,
    fields,
}: AdvertsTableContextType): Column<Advert>[] =>
    [
        makeColumn(true, {
            key: 'image',
            label: fields.images?.label || '',
            getter: () => '',
            cell: ({ images }) => createAdvertImage(images),
        }),
        makeColumn(fields.title?.visible, {
            key: 'title',
            label: fields.title?.label || '',
            sortField: 'title',
            getter: ({ title }) => title,
        }),
        makeColumn(fields.category?.visible, {
            key: 'category',
            label: fields.category?.label || '',
            getter: ({ category }) =>
                categoryTree
                    .pathById(category)
                    .map(({ label }) => label)
                    .join(' - '),
        }),
        makeColumn(fields.tags?.visible, {
            key: 'tags',
            label: fields.tags?.label || '',
            getter: ({ tags }) => tags.join(','),
        }),
        makeColumn(fields.reference?.visible, {
            key: 'reference',
            label: fields.reference?.label || '',
            sortField: 'reference',
            getter: ({ reference }) => reference,
        }),
        makeColumn(fields.notes?.visible, {
            key: 'notes',
            label: fields.notes?.label || '',
            sortField: 'notes',
            getter: ({ notes }) => notes,
        }),
        makeColumn(fields.lendingPeriod?.visible, {
            key: 'lendingPeriod',
            label: fields.lendingPeriod?.label || '',
            sortField: 'lendingPeriod',
            getter: ({ lendingPeriod }) => lendingPeriod.toString(),
        }),
        makeColumn(fields.lendingPeriod?.visible, {
            key: 'isOverdue',
            label: 'Försenad?',
            getter: ({ meta }) =>
                meta.claims.some(({ isOverdue }) => isOverdue),
            // eslint-disable-next-line react/no-unstable-nested-components
            cell: ({ meta: { claims } }) =>
                claims.some(({ isOverdue }) => isOverdue) ? (
                    <EventBusyIcon />
                ) : null,
        }),
        makeColumn(true, {
            key: 'visit-link',
            label: '',
            getter: ({ id }) => `/advert/${id}`,
            header: () => null,
            cell: ({ id }) =>
                createLink(`/advert/${id}`, <OpenInBrowserIcon />),
        }),
        makeColumn(true, {
            key: 'edit-link',
            label: '',
            getter: ({ id }) => `/advert/edit/${id}`,
            header: () => null,
            cell: ({ id }) => createLink(`/advert/edit/${id}`, <EditIcon />),
        }),
    ].filter(({ key }) => key)
