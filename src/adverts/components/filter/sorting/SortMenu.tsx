import { Menu, MenuItem } from '@mui/material'
import { AdvertFilterInput } from 'adverts'
import { getAdvertFieldSortOptions } from 'hard-coded-config'
import { PhraseContext } from 'phrases'
import { FC, useContext, useMemo } from 'react'

export const SortMenu: FC<{
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
    anchor: HTMLElement | null
    onClose: () => void
}> = ({ searchParams, setSearchParams, anchor, onClose }) => {
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
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => onClose()}>
            {sortOptions.map((option) => (
                <MenuItem
                    selected={option === bestMatchingOption}
                    key={option.key}
                    onClick={() => {
                        setSearchParams({
                            ...searchParams,
                            sorting: option.sorting,
                        })
                        onClose()
                    }}
                >
                    {option.label}
                </MenuItem>
            ))}
        </Menu>
    )
}
