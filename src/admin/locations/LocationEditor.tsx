import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material'

import { AdvertLocation } from 'adverts'
import { isValidString } from 'lib/string-utils'

interface LocationEditorProps {
    module: AdvertLocation
    onUpdate: (module: AdvertLocation) => void
    onApply: () => void
    onClose: () => void
}

export const LocationEditor = (props: LocationEditorProps) => {
    const { module, onUpdate, onApply, onClose } = props

    const patch = (key: string, value: string) => {
        onUpdate({
            ...module,
            [key]: value,
        })
    }

    const isValid = () =>
        isValidString(module.adress) &&
        isValidString(module.city) &&
        isValidString(module.name) &&
        isValidString(module.zipCode)

    const validate = () => isValid() && onApply()

    return (
        <Dialog open fullWidth onClose={onClose}>
            <DialogTitle>Redigera adress</DialogTitle>
            <Box component="form">
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            key={0}
                            fullWidth
                            label="Namn"
                            error={!isValidString(module.name)}
                            value={module.name}
                            onChange={(e) => patch('name', e.target.value)}
                            autoComplete="name"
                            required
                            autoFocus
                        />
                        <TextField
                            key={1}
                            fullWidth
                            label="Address"
                            error={!isValidString(module.adress)}
                            value={module.adress}
                            onChange={(e) => patch('adress', e.target.value)}
                            autoComplete="street-address"
                            required
                        />
                        <TextField
                            key={2}
                            fullWidth
                            label="Postnummer"
                            error={!isValidString(module.zipCode)}
                            value={module.zipCode}
                            onChange={(e) => patch('zipCode', e.target.value)}
                            autoComplete="postal-code"
                            required
                        />
                        <TextField
                            key={3}
                            fullWidth
                            label="Stad"
                            error={!isValidString(module.city)}
                            value={module.city}
                            onChange={(e) => patch('city', e.target.value)}
                            autoComplete="address-level2"
                            required
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
