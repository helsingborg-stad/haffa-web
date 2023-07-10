import { FC, PropsWithChildren } from 'react'
import { Box, Grid } from '@mui/material'
import { AdvertFilterInput } from 'adverts'
import { SortingButton } from './SortingButton'
import { FreeTextSearchInput } from './FreeTextSearchInput'

export const SearchableAdvertsList: FC<
    {
        searchParams: AdvertFilterInput
        setSearchParams: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ searchParams, setSearchParams, children }) => (
    <Box>
        <Grid container>
            <Grid item sx={{ flex: 1 }}>
                <FreeTextSearchInput
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Grid>
            <Grid item sx={{ ml: 1, alignSelf: 'center' }}>
                <SortingButton
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Grid>
        </Grid>

        {children}
    </Box>
)
