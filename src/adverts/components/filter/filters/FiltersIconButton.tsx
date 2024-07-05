import { Badge, Box, Button, Stack } from '@mui/material'
import { FC } from 'react'

import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import { AdvertFilterInput } from 'adverts'
import ChecklistIcon from '@mui/icons-material/Checklist'

const countScalarValuesRec = (o: any): number =>
    // eslint-disable-next-line no-nested-ternary
    typeof o === 'string'
        ? 1
        : typeof o === 'number'
        ? 1
        : Object.values(o || []).reduce<number>(
              (s, e) => s + countScalarValuesRec(e),
              0
          )

const countSelectedItems = (searchParams: AdvertFilterInput) =>
    countScalarValuesRec(searchParams.fields)

export const FiltersIconButton: FC<{
    searchParams: AdvertFilterInput
    onClick: (anchor: HTMLElement) => void
}> = ({ searchParams, onClick }) => {
    const hasFilter = countSelectedItems(searchParams) > 0
    return (
        <Badge
            badgeContent={hasFilter ? <ChecklistIcon /> : null}
            color="secondary"
        >
            <Button
                variant={hasFilter ? 'contained' : 'text'}
                color={hasFilter ? 'primary' : 'inherit'}
                onClick={(e) => onClick(e.currentTarget)}
            >
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
}
