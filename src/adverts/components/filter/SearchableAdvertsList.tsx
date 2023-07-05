import { FC, PropsWithChildren } from 'react'
import { Box, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
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
            type="search"
            fullWidth
            sx={{ my: 2 }}
            InputProps={{
                style: { fontSize: '150%' },
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
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
