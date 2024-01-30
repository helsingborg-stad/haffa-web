import {
    Autocomplete,
    TextField,
    TextFieldProps,
    Typography,
    debounce,
} from '@mui/material'
import { Advert, AdvertsContext } from 'adverts'
import { FC, useContext, useMemo, useState } from 'react'

export const SelectSampleAdvert: FC<
    TextFieldProps & {
        onAdvertSelected: (advert: Advert | null) => void
    }
> = ({ onAdvertSelected, ...props }) => {
    const { listAdverts } = useContext(AdvertsContext)
    const [adverts, setAdverts] = useState<Advert[]>([])
    const searchAdverts = useMemo(
        () =>
            debounce(
                (search: string) =>
                    listAdverts({ search }).then(({ adverts }) =>
                        setAdverts(adverts)
                    ),
                100
            ),
        [listAdverts, setAdverts]
    )
    return (
        <Autocomplete
            options={adverts}
            renderOption={(props, advert) => (
                <Typography key={advert.id} {...props}>
                    {advert.title}
                </Typography>
            )}
            onInputChange={(_, search) => searchAdverts(search)}
            onChange={(_, value) => onAdvertSelected(value)}
            getOptionLabel={(advert) => advert.title}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
                <TextField
                    {...props}
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        type: 'search',
                    }}
                />
            )}
        />
    )
}
