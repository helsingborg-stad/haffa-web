import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectProps,
} from '@mui/material'

export const PreviewSelect = (props: SelectProps & { key: number }) => {
    let text = 'N/A'
    if (props.color) {
        text = props.color
    } else if (props.disabled) {
        text = 'disabled'
    } else if (props.error) {
        text = 'error'
    }
    const mt = props.variant === 'standard' ? 3 : 2
    return (
        <FormControl
            key={props.key}
            variant={props.variant}
            fullWidth
            sx={{ mt }}
        >
            <InputLabel id={text}>{text}</InputLabel>
            <Select {...props} label={text} labelId={text}>
                <MenuItem>{text}</MenuItem>
            </Select>
        </FormControl>
    )
}
