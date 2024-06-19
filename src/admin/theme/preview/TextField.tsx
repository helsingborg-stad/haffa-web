import { TextField, TextFieldProps } from '@mui/material'

const phrases: Record<string, [string, string]> = {
    primary: ['Primär', 'Detta är en ett textfält med primär färg'],
    secondary: ['Sekundär', 'Detta är ett textfält med sekundär färg'],
}

export const PreviewTextField = (props: TextFieldProps) => {
    const { color = 'primary' } = props
    const [title = 'N/A', body = 'N/A'] = phrases[color]

    let text = body
    if (props.disabled) {
        text = 'Detta är ett inaktivt textfält'
    }
    if (props.error) {
        text = 'Detta är ett textfält med felaktig data'
    }
    const mt = props.variant === 'standard' ? 3 : 2
    return (
        <TextField
            {...props}
            key={props.key}
            fullWidth
            sx={{ mt }}
            label={title}
            value={text}
        />
    )
}
