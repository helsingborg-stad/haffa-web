import { TextField, TextFieldProps } from '@mui/material'

export const PreviewTextField = (props: TextFieldProps) => {
    let text = 'N/A'
    if (props.color) {
        text =
            {
                info: 'Information',
                primary: 'Primärt fält',
                secondary: 'Sekundärt fält',
                success: 'Lyckades',
                error: 'Fel',
                warning: 'Varning',
            }[props.color] ?? 'N/A'
    } else if (props.disabled) {
        text = 'Inaktivt fält'
    } else if (props.error) {
        text = 'Felaktig data'
    }
    const mt = props.variant === 'standard' ? 3 : 2
    return (
        <TextField {...props} fullWidth sx={{ mt }} label={text} value={text} />
    )
}
