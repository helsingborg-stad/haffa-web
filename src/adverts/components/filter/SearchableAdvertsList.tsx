import { Box, Stack } from '@mui/material'
import type { AdvertFilterInput } from 'adverts'
import { type FC, type PropsWithChildren, useState } from 'react'
import { FilterDialog, FiltersIconButton } from './filters'
import { SearchInput } from './search'
import { SortMenu } from './sorting'
import { SortIconButton } from './sorting/SortIconButton'

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
        <Stack direction="row" spacing={1}>
            <Box sx={{ flex: 1 }}>
                <SearchInput
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Box>
            <Box>
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
            </Box>
            <Box>
                <SortIconButton onClick={setSortMenuAnchor} />
                <SortMenu
                    anchor={sortMenuAnchor}
                    onClose={() => setSortMenuAnchor(null)}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Box>
        </Stack>
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
