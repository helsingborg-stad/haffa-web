import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { AdvertFilterInput } from 'adverts/types'
import useAsync from 'hooks/use-async'
import { PhraseContext } from 'phrases'
import { PickupLocationContext } from 'pickup-locations'
import { FC, Fragment, useContext, useId } from 'react'

export const SelectPickupLocation: FC<{
    filter: AdvertFilterInput
    setFilter: (p: AdvertFilterInput) => void
}> = ({ filter, setFilter }) => {
    const { getPickupLocations } = useContext(PickupLocationContext)
    const { phrase } = useContext(PhraseContext)

    const v = useAsync(async () =>
        (await getPickupLocations()).filter(({ trackingName }) => trackingName)
    )

    const labelId = useId()
    const label = phrase('ADMIN_PICKUPLOCATIONS_TITLE', 'Utlämningsplatser')
    return v({
        pending: () => <Fragment key="pending" />,
        rejected: () => <Fragment key="rejected" />,
        resolved: (locations) =>
            locations.length ? (
                <FormControl fullWidth key="resolved">
                    <InputLabel id={labelId}>{label}</InputLabel>
                    <Select
                        labelId={labelId}
                        value={
                            filter.workflow?.pickupLocationTrackingNames || []
                        }
                        label={label}
                        onChange={({ target: { value } }) =>
                            setFilter({
                                ...filter,
                                workflow: {
                                    ...filter.workflow,
                                    pickupLocationTrackingNames: Array.isArray(
                                        value
                                    )
                                        ? value
                                        : value.split(','),
                                },
                            })
                        }
                    >
                        <MenuItem value="">
                            {phrase('VALUE_EMPTY', '(inget värde)')}
                        </MenuItem>
                        {locations.map((l) => (
                            <MenuItem value={l.trackingName}>
                                {l.trackingName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <Fragment key="resolved-empty" />
            ),
    })
}
