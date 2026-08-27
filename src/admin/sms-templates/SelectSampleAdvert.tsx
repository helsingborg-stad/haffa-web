import {
    Autocomplete,
    debounce,
    TextField,
    type TextFieldProps,
    Typography,
} from '@mui/material'
import { type Advert, AdvertsContext } from 'adverts'
import { type FC, useContext, useMemo, useState } from 'react'

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
        [listAdverts]
    )
    return (
        <Autocomplete
            options={adverts}
            renderOption={({ key, ...optionProps }, advert) => (
                <Typography key={key} {...optionProps}>
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
                    slotProps={{
                        ...params.slotProps,

                        input: {
                            ...params.slotProps.input,
                            type: 'search',
                        },
                    }}
                />
            )}
        />
    )
}
