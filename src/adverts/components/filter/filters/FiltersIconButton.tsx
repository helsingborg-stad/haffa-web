import { Badge, Box, Button, Stack } from '@mui/material'
import { FC } from 'react'

import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import { AdvertFilterInput } from 'adverts'

const countSelectedItems = (searchParams: AdvertFilterInput) =>
    Object.values(searchParams.fields ?? {})
        .filter((f) => f?.in)
        .reduce((p, { in: c }) => p + (c?.length ?? 0), 0)

export const FiltersIconButton: FC<{
    searchParams: AdvertFilterInput
    onClick: (anchor: HTMLElement) => void
}> = ({ searchParams, onClick }) => (
    <Badge badgeContent={countSelectedItems(searchParams)} color="secondary">
        <Button color="inherit" onClick={(e) => onClick(e.currentTarget)}>
            <Stack
                direction="column"
                sx={{
                    alignItems: 'center',
                    fontSize: { xs: 'x-small', sm: '' },
                    fontWeight: 'initial',
                    textTransform: 'none',
                }}
            >
                <FilterListOutlinedIcon />
                <Box>Filter</Box>
            </Stack>
        </Button>
    </Badge>
)
