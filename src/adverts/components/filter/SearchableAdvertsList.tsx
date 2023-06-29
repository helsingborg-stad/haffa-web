import { FC, PropsWithChildren } from 'react'
import { Box, TextField } from '@mui/material'
import { AdvertsSearchParams } from '../../types'

export const SearchableAdvertsList: FC<
    {
        searchParams: AdvertsSearchParams
        setSearchParams: (p: AdvertsSearchParams) => void
    } & PropsWithChildren
> = ({ searchParams, setSearchParams, children }) => (
    <Box>
        <TextField
            value={searchParams.search}
            onChange={(e) =>
                setSearchParams({
                    ...searchParams,
                    search: e.target.value,
                })
            }
        />
        {children}
    </Box>
)
