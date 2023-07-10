import { AdvertFilterInput, AdvertSorting } from 'adverts'
import { FC, useCallback, useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'

interface SortOption {
    label: string
    ascending: boolean
    sorting: AdvertSorting
}
const sortOptions: SortOption[] = [
    {
        label: 'A-Ö',
        ascending: true,
        sorting: { field: 'title', ascending: true },
    },
    {
        label: 'Ö-A',
        ascending: false,
        sorting: { field: 'title', ascending: false },
    },
    {
        label: 'Äldst',
        ascending: true,
        sorting: { field: 'createdAt', ascending: true },
    },
    {
        label: 'Nyast',
        ascending: false,
        sorting: { field: 'createdAt', ascending: false },
    },
]

export const SortingButton: FC<{
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({ searchParams, setSearchParams }) => {
    const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(
        null
    )
    const showSortMenu = useCallback((anchor: HTMLElement | null) => {
        setSortMenuAnchor(anchor)
    }, [])

    const applySortOption = useCallback((sorting: AdvertSorting) => {
        showSortMenu(null)
        setSearchParams({
            ...searchParams,
            sorting,
        })
    }, [])

    const bestMatchingOption =
        sortOptions.find(
            (option) =>
                option.sorting.field === searchParams?.sorting?.field &&
                option.sorting.ascending === searchParams?.sorting?.ascending
        ) || sortOptions[0]

    return (
        <>
            <Button
                variant="outlined"
                onClick={(e) => showSortMenu(e.currentTarget)}
            >
                {bestMatchingOption.label}
            </Button>
            <Menu
                anchorEl={sortMenuAnchor}
                open={!!sortMenuAnchor}
                onClose={() => setSortMenuAnchor(null)}
            >
                {sortOptions.map((option, index) => (
                    <MenuItem
                        selected={option === bestMatchingOption}
                        key={index}
                        onClick={() => applySortOption(option.sorting)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
