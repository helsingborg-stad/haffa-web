import SearchIcon from '@mui/icons-material/Search'
import { Grid, InputAdornment, TextField } from '@mui/material'
import {
    FilterDialog,
    FiltersIconButton,
} from 'adverts/components/filter/filters'
import type { AdvertFilterInput } from 'adverts/types'
import { type FC, type PropsWithChildren, useState } from 'react'

export const FilterPanel: FC<
    {
        filter: AdvertFilterInput
        setFilter: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ filter, setFilter }) => {
    const [showFilter, setShowFilter] = useState(false)
    const [search, setSearch] = useState(filter.search || '')

    return (
        <Grid container>
            <Grid sx={{ flex: 1 }}>
                <TextField
                    fullWidth
                    type="search"
                    value={search}
                    slotProps={{ input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    } }}
                    onChange={({ target: { value } }) => {
                        setSearch(value)
                        setFilter({
                            ...filter,
                            search: value,
                        })
                    }}
                />
            </Grid>
            <Grid>
                <FiltersIconButton
                    searchParams={filter}
                    onClick={() => setShowFilter(true)}
                />
                <FilterDialog
                    open={showFilter}
                    onClose={() => setShowFilter(false)}
                    searchParams={filter}
                    setSearchParams={setFilter}
                />
            </Grid>
        </Grid>
    )
}
