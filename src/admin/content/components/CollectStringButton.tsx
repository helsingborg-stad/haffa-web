import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'
import { PropsWithChildren, useState } from 'react'

export const CollectStringButton = (
    props: PropsWithChildren & {
        title: string
        initial: string
        label: string
        onUpdate: (result: string) => void
        validate: (value: string) => boolean
    }
) => {
    const { title, label, initial, onUpdate, validate, children } = props

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(initial)

    const onClose = () => {
        setOpen(false)
    }
    const onOpen = () => {
        setValue(initial)
        setOpen(true)
    }
    return (
        <>
            <Button variant="outlined" onClick={onOpen}>
                {children}
            </Button>
            <Dialog fullWidth open={open} onClose={onClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        error={!validate(value)}
                        label={label}
                        value={value}
                        fullWidth
                        onChange={(e) => setValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Avbryt</Button>
                    <Button
                        disabled={!validate(value)}
                        onClick={() => {
                            onClose()
                            onUpdate(value)
                        }}
                        type="submit"
                    >
                        Spara
                    </Button>
                </DialogActions>
            </Dialog>{' '}
        </>
    )
}
