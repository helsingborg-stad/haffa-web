import { FC, PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import { AdvertFilterInput } from 'adverts'
import { FreeTextSearchInput } from './FreeTextSearchInput'

export const SearchableAdvertsList: FC<
    {
        searchParams: AdvertFilterInput
        setSearchParams: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ searchParams, setSearchParams, children }) => (
    <Box>
        <FreeTextSearchInput
            searchParams={searchParams}
            setSearchParams={setSearchParams}
        />
        {children}
    </Box>
)
