import EventBusyIcon from '@mui/icons-material/EventBusy'
import EditIcon from '@mui/icons-material/Edit'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import CheckIcon from '@mui/icons-material/Check'
import { Box, Stack, Typography } from '@mui/material'
import { sortBy } from 'lib/sort-by'
import { PhraseContextType } from 'phrases'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'
import {
    AdvertTableColumn,
    AdvertsTableContextType,
} from './AdvertsTable/types'

export const createLink = (to: string | undefined, icon: ReactNode) => (
    <NavLink to={to ?? ''} style={{ color: 'inherit', textDecoration: 'none' }}>
        {icon}
    </NavLink>
)

export const createAdvertImage = (imageUrl?: string, advertUrl?: string) =>
    createLink(
        advertUrl,
        <Box
            component="img"
            src={imageUrl ?? '/empty-advert.svg'}
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

export const createColumns = (
    { categoryTree, fields }: AdvertsTableContextType,
    phrase: PhraseContextType['phrase']
): AdvertTableColumn[] => [
    {
        field: 'image',
        headerAlign: 'center',
        sortable: false,
        headerName: phrase('DASHBOARD_HEADER_IMAGE', 'Bild'),
        renderCell: ({ value: [imageUrl, advertUrl] }) =>
            createAdvertImage(imageUrl, advertUrl),
    },
    {
        field: 'title',
        headerName: phrase('DASHBOARD_HEADER_TITLE', fields.title?.label || ''),
    },
    {
        field: 'category',
        sortable: false,
        headerName: phrase(
            'DASHBOARD_HEADER_CATEGORY',
            fields.category?.label || ''
        ),
        valueGetter: (value) =>
            categoryTree
                .pathById(value)
                .map(({ label }) => label)
                .join(' - '),
    },
    {
        field: 'tags',
        sortable: false,
        headerName: phrase('DASHBOARD_HEADER_TAGS', fields.tags?.label || ''),
        renderCell: ({ value }) => createTagList(value),
    },
    {
        field: 'reference',
        headerName: phrase(
            'DASHBOARD_HEADER_REFERENCE',
            fields.reference?.label || ''
        ),
        headerAlign: 'right',
        align: 'right',
    },
    {
        field: 'notes',
        headerName: phrase('DASHBOARD_HEADER_NOTES', fields.notes?.label || ''),
    },
    {
        field: 'place',
        headerName: phrase('DASHBOARD_HEADER_PLACE', fields.place?.label || ''),
    },
    {
        field: 'trackingName',
        headerName: phrase('DASHBOARD_HEADER_TRACKING', 'Utlämningsställe'),
        sortable: false,
    },
    {
        field: 'lendingPeriod',
        type: 'number',
        headerName: phrase(
            'DASHBOARD_HEADER_PERIOD',
            fields.lendingPeriod?.label || ''
        ),
    },
    {
        field: 'expectedReturnDate',
        type: 'string',
        sortable: false,
        headerName: phrase('DASHBOARD_HEADER_RETURN', 'Återlämnas'),
    },
    {
        field: 'isOverdue',
        align: 'center',
        sortable: false,
        headerName: phrase('DASHBOARD_HEADER_OVERDUE', 'Försenad'),
        renderCell: ({ value }) => value && <EventBusyIcon />,
    },
    {
        field: 'isPicked',
        align: 'center',
        sortable: false,
        headerName: phrase('DASHBOARD_HEADER_PICKED', 'Plockad'),
        renderCell: ({ value }) => value && <CheckIcon />,
    },
    {
        field: 'visitLink',
        align: 'center',
        sortable: false,
        headerName: phrase('DASHBOARD_HEADER_NAVIGATE', 'Gå till'),
        renderCell: ({ value }) => createLink(value, <OpenInBrowserIcon />),
    },
    {
        field: 'editLink',
        align: 'center',
        sortable: false,
        headerName: phrase('DASHBOARD_HEADER_EDIT', 'Redigera'),
        renderCell: ({ value }) => createLink(value, <EditIcon />),
    },
]
