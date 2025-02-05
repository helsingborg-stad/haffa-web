import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { AdvertFilterInput } from 'adverts/types'
import useAsync from 'hooks/use-async'
import { PhraseContext } from 'phrases'
import { FC, Fragment, useContext, useId } from 'react'
import { TermsContext } from 'terms'

export const SelectPlace: FC<{
    filter: AdvertFilterInput
    setFilter: (p: AdvertFilterInput) => void
}> = ({ filter, setFilter }) => {
    const { getTerms } = useContext(TermsContext)
    const { phrase } = useContext(PhraseContext)

    const v = useAsync(async () =>
        (await getTerms()).places.filter((place) => place)
    )

    const labelId = useId()
    const label = phrase('TERMS_FIELD_PLACES', 'Platser')
    return v({
        pending: () => <Fragment key="pending" />,
        rejected: () => <Fragment key="rejected" />,
        resolved: (places) =>
            places.length ? (
                <FormControl fullWidth key="resolved">
                    <InputLabel id={labelId}>{label}</InputLabel>
                    <Select
                        multiple
                        labelId={labelId}
                        value={filter.workflow?.places || []}
                        label={label}
                        onChange={({ target: { value } }) =>
                            setFilter({
                                ...filter,
                                workflow: {
                                    ...filter.workflow,
                                    places: Array.isArray(value)
                                        ? value
                                        : value.split(','),
                                },
                            })
                        }
                    >
                        {places.map((p) => (
                            <MenuItem value={p}>{p}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <Fragment key="resolved-empty" />
            ),
    })
}
