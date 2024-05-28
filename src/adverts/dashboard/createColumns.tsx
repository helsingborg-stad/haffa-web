import EventBusyIcon from '@mui/icons-material/EventBusy'
import EditIcon from '@mui/icons-material/Edit'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import CheckIcon from '@mui/icons-material/Check'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { sortBy } from 'lib/sort-by'
import {
    AdvertTableColumn,
    AdvertsTableContextType,
} from './AdvertsTable/types'

export const createLink = (to: string | undefined, icon: ReactNode) => (
    <NavLink to={to ?? ''} style={{ color: 'inherit', textDecoration: 'none' }}>
        {icon}
    </NavLink>
)

export const createAdvertImage = (image?: string) => (
    <Box
        component="img"
        src={image ?? '/empty-advert.svg'}
        sx={{
            height: 48,
            width: 48,
            objectFit: 'cover',
        }}
    />
)

const createTagList = (tags?: string[]) => (
    <Stack direction="column">
        {tags?.sort(sortBy((tag) => tag.toLowerCase())).map((tag, index) => (
            <Box key={index}>
                <Typography style={{ whiteSpace: 'nowrap' }}>{tag}</Typography>
            </Box>
        ))}
    </Stack>
)

export const createColumns = ({
    categoryTree,
    fields,
}: AdvertsTableContextType): AdvertTableColumn[] => [
    {
        field: 'image',
        headerAlign: 'center',
        sortable: false,
        headerName: 'Bild',
        renderCell: ({ value }) => createAdvertImage(value),
        minWidth: 68,
        maxWidth: 68,
    },
    {
        field: 'title',
        headerName: fields.title?.label || '',
        width: 200,
    },
    {
        field: 'category',
        sortable: false,
        headerName: fields.category?.label || '',
        valueGetter: (value) =>
            categoryTree
                .pathById(value)
                .map(({ label }) => label)
                .join(' - '),
    },
    {
        field: 'tags',
        sortable: false,
        headerName: fields.tags?.label || '',
        renderCell: ({ value }) => createTagList(value),
    },
    {
        field: 'reference',
        headerName: fields.reference?.label || '',
        headerAlign: 'right',
        align: 'right',
    },
    {
        field: 'notes',
        headerName: fields.notes?.label || '',
    },
    {
        field: 'lendingPeriod',
        type: 'number',
        headerName: fields.lendingPeriod?.label || '',
    },
    {
        field: 'isOverdue',
        align: 'center',
        sortable: false,
        headerName: 'Försenad?',
        renderCell: ({ value }) => value && <EventBusyIcon />,
    },
    {
        field: 'isPicked',
        align: 'center',
        sortable: false,
        headerName: 'Plockad?',
        renderCell: ({ value }) => value && <CheckIcon />,
    },
    {
        field: 'visitLink',
        align: 'center',
        sortable: false,
        headerName: 'Gå till',
        renderCell: ({ value }) => createLink(value, <OpenInBrowserIcon />),
    },
    {
        field: 'editLink',
        align: 'center',
        sortable: false,
        headerName: 'Redigera',
        renderCell: ({ value }) => createLink(value, <EditIcon />),
    },
]
