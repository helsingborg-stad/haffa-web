import { TextField, TextFieldProps } from '@mui/material'

export const PreviewTextField = (props: TextFieldProps) => {
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
        <TextField {...props} fullWidth sx={{ mt }} label={text} value={text} />
    )
}
