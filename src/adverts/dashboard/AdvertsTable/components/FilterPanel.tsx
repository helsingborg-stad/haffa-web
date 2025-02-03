import { Grid, InputAdornment, TextField } from '@mui/material'
import { AdvertFilterInput } from 'adverts/types'
import { FC, PropsWithChildren, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import {
    FilterDialog,
    FiltersIconButton,
} from 'adverts/components/filter/filters'

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
            <Grid item sx={{ flex: 1 }}>
                <TextField
                    fullWidth
                    type="search"
                    value={search}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={({ target: { value } }) => {
                        setSearch(value)
                        setFilter({
                            ...filter,
                            search: value,
                        })
                    }}
                />
            </Grid>
            <Grid item>
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
