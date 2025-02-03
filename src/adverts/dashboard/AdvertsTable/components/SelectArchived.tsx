import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material'
import { AdvertFilterInput } from 'adverts/types'
import { PhraseContext } from 'phrases'
import { FC, useContext } from 'react'

export const SelectArchived: FC<{
    filter: AdvertFilterInput
    setFilter: (p: AdvertFilterInput) => void
}> = ({ filter, setFilter }) => {
    const { phrase } = useContext(PhraseContext)
    return (
        <FormControl>
            <FormLabel id="archive-status-label">Hantera</FormLabel>
            <RadioGroup
                row
                aria-labelledby="archive-status-label"
                name="archive-status-group"
                value={String(filter.restrictions?.isArchived ?? false)}
                onChange={(e) =>
                    setFilter({
                        ...filter,
                        restrictions: {
                            ...filter.restrictions,
                            isArchived: e.target.value === 'true',
                        },
                    })
                }
            >
                <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label={phrase('MYADVERTS_ACTIVE', 'Aktiva')}
                />
                <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label={phrase('MYADVERTS_ARCHIVED', 'Arkiverade')}
                />
            </RadioGroup>
        </FormControl>
    )
}
