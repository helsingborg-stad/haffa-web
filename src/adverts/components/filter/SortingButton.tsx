import { AdvertFilterInput, AdvertSorting } from 'adverts'
import { FC, useContext, useMemo, useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { PhraseContext } from 'phrases/PhraseContext'
import { getAdvertFieldSortOptions } from 'hard-coded-config'

export const SortingButton: FC<{
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({ searchParams, setSearchParams }) => {
    const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(
        null
    )
    const showSortMenu = (anchor: HTMLElement | null) => {
        setSortMenuAnchor(anchor)
    }

    const applySortOption = (sorting: AdvertSorting) => {
        setSearchParams({
            ...searchParams,
            sorting,
        })
        showSortMenu(null)
    }

    const { phrase } = useContext(PhraseContext)

    const sortOptions = useMemo(
        () => getAdvertFieldSortOptions(phrase),
        [phrase]
    )

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
                {sortOptions.map((option) => (
                    <MenuItem
                        selected={option === bestMatchingOption}
                        key={option.key}
                        onClick={() => applySortOption(option.sorting)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
