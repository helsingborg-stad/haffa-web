import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material'

import { isValidString } from 'lib/string-utils'
import { PhraseContext } from 'phrases'
import { PickupLocation } from 'pickup-locations/types'
import { FC, useContext } from 'react'

export const PickupLocationEditor: FC<{
    location: PickupLocation
    tags: string[]
    onUpdate: (location: PickupLocation) => void
    onApply: () => void
    onClose: () => void
}> = ({ location, tags, onUpdate, onApply, onClose }) => {
    const { phrase } = useContext(PhraseContext)
    const patch = (p: Partial<PickupLocation>) => {
        onUpdate({
            ...location,
            ...p,
        })
    }

    const isValid = () =>
        [location.adress, location.city, location.zipCode].some(isValidString)

    const validate = () => isValid() && onApply()

    return (
        <Dialog open fullWidth onClose={onClose}>
            <DialogTitle>Redigera adress</DialogTitle>
            <Box component="form">
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            key="name"
                            fullWidth
                            label={phrase('PICKUPLOCATION_FIELD_NAME', 'Namn')}
                            error={!isValidString(location.name)}
                            value={location.name}
                            onChange={(e) => patch({ name: e.target.value })}
                            autoComplete="name"
                            required
                            autoFocus
                        />
                        <TextField
                            key="address"
                            fullWidth
                            label={phrase(
                                'PICKUPLOCATION_FIELD_ADRESS',
                                'Address'
                            )}
                            error={!isValidString(location.adress)}
                            value={location.adress}
                            onChange={(e) => patch({ adress: e.target.value })}
                            autoComplete="street-address"
                            required
                        />
                        <TextField
                            key="zipcode"
                            fullWidth
                            label={phrase(
                                'PICKUPLOCATION_FIELD_ZIPCODE',
                                'Postnummer'
                            )}
                            value={location.zipCode}
                            onChange={(e) => patch({ zipCode: e.target.value })}
                            autoComplete="postal-code"
                        />
                        <TextField
                            key="city"
                            fullWidth
                            label={phrase('PICKUPLOCATION_FIELD_CITY', 'Stad')}
                            error={!isValidString(location.city)}
                            value={location.city}
                            onChange={(e) => patch({ city: e.target.value })}
                            autoComplete="address-level2"
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            key="trackingName"
                            fullWidth
                            label={phrase(
                                'PICKUPLOCATION_FIELD_TRACKINGNAME',
                                'Spårningsnamn'
                            )}
                            value={location.trackingName}
                            onChange={(e) =>
                                patch({ trackingName: e.target.value })
                            }
                        />
                        <TextField
                            key="notifyEmail"
                            fullWidth
                            label={phrase(
                                'PICKUPLOCATION_FIELD_NOTIFYEMAIL',
                                'Email för notifikation'
                            )}
                            value={location.notifyEmail}
                            onChange={(e) =>
                                patch({ notifyEmail: e.target.value })
                            }
                            autoComplete="email"
                        />
                        <Autocomplete
                            multiple
                            value={location.tags}
                            options={tags}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={phrase(
                                        'PICKUPLOCATION_FIELD_TAGS',
                                        'Matcha annonstaggar'
                                    )}
                                />
                            )}
                            onChange={(_, values) => {
                                patch({ tags: values })
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        disabled={!isValid()}
                        onClick={validate}
                    >
                        Uppdatera
                    </Button>
                    <Button onClick={onClose}>Stäng</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
