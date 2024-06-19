import { Alert, AlertColor, AlertProps, AlertTitle } from '@mui/material'

const phrases: Record<AlertColor, [string, string]> = {
    info: ['Information', 'Detta är en notis för ett informationsmeddelande'],
    success: ['Genomfört', 'Detta är en notis för en genomförd handling'],
    error: ['Fel', 'Detta är en notis för ett felmeddelande'],
    warning: ['Varning', 'Detta är en notis för ett varningsmeddelande'],
}

export const PreviewAlert = (props: AlertProps) => {
    const { severity = 'success' } = props
    const [title, body] = phrases[severity]

    return (
        <Alert {...props} sx={{ mt: 1 }}>
            <AlertTitle>{title}</AlertTitle>
            {body}
        </Alert>
    )
}
