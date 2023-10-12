import { FC } from 'react'
import { Button } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'

export interface FilterButtonProps {
    onClick: () => void
}

export const FilterButton: FC<FilterButtonProps> = ({ onClick }) => (
    <Button variant="outlined" onClick={onClick}>
        <FilterListIcon />
    </Button>
)
