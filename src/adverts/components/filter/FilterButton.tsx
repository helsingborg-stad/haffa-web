import { FC } from 'react'
import { Badge, Button } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { AdvertFilterInput } from 'adverts'

export const FilterButton: FC<{
    searchParams: AdvertFilterInput
    onClick: () => void
}> = ({ searchParams, onClick }) => (
    <Badge
        badgeContent={searchParams.fields?.category?.in?.length}
        color="secondary"
    >
        <Button variant="outlined" onClick={onClick}>
            <FilterListIcon />
        </Button>
    </Badge>
)
