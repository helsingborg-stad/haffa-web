import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    SvgIcon,
    SvgIconProps,
    TextField,
    TextFieldProps,
} from '@mui/material'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { SketchPicker } from 'react-color'

const ColorButton = (props: SvgIconProps & ButtonProps) => (
    <IconButton onClick={props.onClick}>
        <SvgIcon sx={props.sx}>
            <ellipse cx="12" cy="12" rx="12" ry="12" />
        </SvgIcon>
    </IconButton>
)

export const ColorSelect = ({
    onColorChange,
    ...props
}: TextFieldProps & { onColorChange: (color: string) => void }) => {
    const { key = nanoid() } = props
    const [state, setState] = useState<{
        color: string
        isOpen: boolean
    }>({
        color: props.value as string,
        isOpen: false,
    })
    const onClose = () => {
        if (state.isOpen) {
            onColorChange(state.color)
        }
        setState({
            ...state,
            isOpen: !state.isOpen,
        })
    }
    return (
        <>
            <TextField
                {...props}
                key={key}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <ColorButton
                                sx={{ color: props.value as string }}
                                onClick={onClose}
                            />
                        </InputAdornment>
                    ),
                }}
            />
            <Dialog open={state.isOpen} onClose={onClose}>
                <DialogTitle>Välj färg</DialogTitle>
                <DialogContent dividers>
                    <SketchPicker
                        onChange={(color) => {
                            setState({
                                ...state,
                                color: color.hex,
                            })
                        }}
                        color={state.color}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
