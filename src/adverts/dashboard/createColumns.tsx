import EventBusyIcon from '@mui/icons-material/EventBusy'
import EditIcon from '@mui/icons-material/Edit'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { sortBy } from 'lib/sort-by'
import { GridColDef, GridColType, GridRenderCellParams } from '@mui/x-data-grid'
import { AdvertsTableContextType } from './AdvertsTable/types'

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
}: AdvertsTableContextType): GridColDef[] =>
    [
        {
            field: 'image',
            sortable: false,
            headerName: fields.images?.label || '',
            renderCell: ({ value }: GridRenderCellParams<any, string>) =>
                createAdvertImage(value),
        },
        {
            field: 'title',
            headerName: fields.title?.label || '',
        },
        {
            field: 'category',
            sortable: false,
            headerName: fields.category?.label || '',
            valueGetter: (value: string) =>
                categoryTree
                    .pathById(value)
                    .map(({ label }) => label)
                    .join(' - '),
        },
        {
            field: 'tags',
            sortable: false,
            headerName: fields.tags?.label || '',
            renderCell: ({ value }: GridRenderCellParams<any, string[]>) =>
                createTagList(value),
        },
        {
            field: 'reference',
            headerName: fields.reference?.label || '',
        },
        {
            field: 'notes',
            headerName: fields.notes?.label || '',
        },
        {
            field: 'lendingPeriod',
            type: 'number' as GridColType,
            headerName: fields.lendingPeriod?.label || '',
            valueGetter: (value: string) => Number(value),
        },
        {
            field: 'isOverdue',
            sortable: false,
            headerName: 'Försenad?', // eslint-disable-next-line react/no-unstable-nested-components
            renderCell: ({ value }: GridRenderCellParams<any, boolean>) =>
                value && <EventBusyIcon />,
        },
        {
            field: 'visitLink',
            sortable: false,
            headerName: 'Gå till',
            renderCell: ({ value }: GridRenderCellParams<any, string>) =>
                createLink(value, <OpenInBrowserIcon />),
        },
        {
            field: 'editLink',
            sortable: false,
            headerName: 'Redigera',
            renderCell: ({ value }: GridRenderCellParams<any, string>) =>
                createLink(value, <EditIcon />),
        },
    ].filter(({ field }) => field)
