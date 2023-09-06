import { FC, PropsWithChildren, useState } from 'react'
import { Box } from '@mui/material'
import { AdvertFilterInput } from 'adverts'
import { FreeTextSearchInput } from './FreeTextSearchInput'
import { FilterDialog, SelectedFilters } from './FilterDialog'

export const SearchableAdvertsList: FC<
    {
        searchParams: AdvertFilterInput
        setSearchParams: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ searchParams, setSearchParams, children }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const openDialog = () => setDialogOpen(true)
    const closeDialog = () => setDialogOpen(false)

    const setFiltersOnSearchParams = (filters: SelectedFilters) => {
        setSearchParams({
            ...searchParams,
            fields: {
                ...searchParams.fields,
                category:
                    filters.categories.length > 0
                        ? {
                              in: filters.categories,
                          }
                        : {},
            },
        })
    }

    const selectedFiltersFromSearchParams = (): SelectedFilters => ({
        categories: searchParams.fields?.category?.in ?? [],
    })

    return (
        <>
            <Box>
                <FreeTextSearchInput
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    onFilterButtonClick={openDialog}
                />
                {children}
            </Box>
            <FilterDialog
                open={dialogOpen}
                closeDialog={closeDialog}
                filters={selectedFiltersFromSearchParams()}
                onFiltersChanged={setFiltersOnSearchParams}
            />
        </>
    )
}
