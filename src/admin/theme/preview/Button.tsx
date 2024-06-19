import { Button, ButtonProps } from '@mui/material'

const phrases = {
    primary: 'Primär',
    secondary: 'Sekundär',
    info: 'Information',
    success: 'Genomfört',
    error: 'Fel',
    warning: 'Varning',
    inherit: '',
}

export const PreviewButton = (props: ButtonProps) => {
    const { color = 'primary' } = props
    return (
        <Button {...props} fullWidth sx={{ mt: 1 }}>
            {props.disabled ? 'Inaktiverad' : phrases[color]}
        </Button>
    )
}
