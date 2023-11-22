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
import { SketchPicker, SketchPickerProps } from 'react-color'

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
}: TextFieldProps &
    SketchPickerProps & { onColorChange: (color: string) => void }) => {
    const { key = nanoid(), label, value, disableAlpha } = props
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
                key={key}
                label={label}
                value={value}
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
                        disableAlpha={disableAlpha}
                        onChange={({ rgb, hex }) => {
                            setState({
                                ...state,
                                color:
                                    disableAlpha === true
                                        ? hex
                                        : `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
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
