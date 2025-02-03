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
import { normalizePickupLocation } from 'pickup-locations'
import { PickupLocation } from 'pickup-locations/types'
import { FC, useCallback, useContext, useMemo, useState } from 'react'

export const PickupLocationDialog: FC<{
    location: PickupLocation
    tags: string[]
    onUpdate: (location: PickupLocation) => void
    onClose: () => void
}> = ({ location, tags, onUpdate, onClose }) => {
    const { phrase } = useContext(PhraseContext)
    const [memo, setMemo] = useState(normalizePickupLocation(location))
    const patch = useCallback(
        (p: Partial<PickupLocation>) => setMemo({ ...memo, ...p }),
        [memo, setMemo]
    )
    const valid = useMemo(
        () => [memo.adress, memo.city, memo.zipCode].some(isValidString),
        [memo]
    )

    return (
        <Dialog open fullWidth onClose={onClose}>
            <DialogTitle>
                {phrase(
                    'PICKUPLOCATION_EDIT_LABEL',
                    'Redigera utlämningsadress'
                )}
            </DialogTitle>
            <Box component="form">
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            key="name"
                            fullWidth
                            label={phrase('PICKUPLOCATION_FIELD_NAME', 'Namn')}
                            error={!isValidString(memo.name)}
                            value={memo.name}
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
                            error={!isValidString(memo.adress)}
                            value={memo.adress}
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
                            value={memo.zipCode}
                            onChange={(e) => patch({ zipCode: e.target.value })}
                            autoComplete="postal-code"
                        />
                        <TextField
                            key="city"
                            fullWidth
                            label={phrase('PICKUPLOCATION_FIELD_CITY', 'Stad')}
                            error={!isValidString(memo.city)}
                            value={memo.city}
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
                            value={memo.trackingName}
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
                            value={memo.notifyEmail}
                            onChange={(e) =>
                                patch({ notifyEmail: e.target.value })
                            }
                            autoComplete="email"
                        />
                        <Autocomplete
                            multiple
                            value={memo.tags}
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
                        disabled={!valid}
                        onClick={() => onUpdate(memo)}
                    >
                        {phrase('ACTION_UPDATE', 'Uppdatera')}
                    </Button>
                    <Button onClick={onClose}>
                        {phrase('ACTION_CLOSE', 'Stäng')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
