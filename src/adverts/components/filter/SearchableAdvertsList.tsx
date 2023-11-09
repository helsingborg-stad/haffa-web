import { FC, PropsWithChildren, useState } from 'react'
import { Box, Grid } from '@mui/material'
import { AdvertFilterInput } from 'adverts'
import { SearchInput } from './search'
import { SortIconButton } from './sorting/SortIconButton'
import { SortMenu } from './sorting'
import { FiltersIconButton, FilterDialog } from './filters'

const FilterPanel: FC<
    {
        searchParams: AdvertFilterInput
        setSearchParams: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ searchParams, setSearchParams }) => {
    const [showFilter, setShowFilter] = useState(false)
    const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(
        null
    )

    return (
        <Grid container>
            <Grid item sx={{ flex: 1 }}>
                <SearchInput
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Grid>
            <Grid item>
                <FiltersIconButton
                    searchParams={searchParams}
                    onClick={() => setShowFilter(true)}
                />
                <FilterDialog
                    open={showFilter}
                    onClose={() => setShowFilter(false)}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Grid>
            <Grid item>
                <SortIconButton onClick={setSortMenuAnchor} />
                <SortMenu
                    anchor={sortMenuAnchor}
                    onClose={() => setSortMenuAnchor(null)}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Grid>
        </Grid>
    )
}

export const SearchableAdvertsList: FC<
    {
        hideFilter?: boolean
        searchParams: AdvertFilterInput
        setSearchParams: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ hideFilter, searchParams, setSearchParams, children }) => (
    <Box>
        {!hideFilter && (
            <FilterPanel
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        )}
        {children}
    </Box>
)
