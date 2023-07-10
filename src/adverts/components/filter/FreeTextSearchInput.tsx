import { AdvertFilterInput } from 'adverts'
import { FC } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'

export const FreeTextSearchInput: FC<{
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({ searchParams, setSearchParams }) => (
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
)
