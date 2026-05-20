import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
import type { AdvertFilterInput } from 'adverts'
import type { FC } from 'react'

export const SearchInput: FC<{
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({ searchParams, setSearchParams }) => (
    <TextField
        value={searchParams.search}
        type="search"
        fullWidth
        slotProps={{ input: {
            // style: { fontSize: '150%' },
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
            ),
        } }}
        onChange={(e) =>
            setSearchParams({
                ...searchParams,
                search: e.target.value,
            })
        }
    />
)
