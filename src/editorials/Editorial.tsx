import { Alert, AlertColor, Box } from '@mui/material'
import { Markdown } from 'components/Markdown'
import { FC } from 'react'

type Variant = 'info'

const VariantToSeverity: Record<Variant, AlertColor> = {
    info: 'info',
}

export const Editorial: FC<{ children: string; variant?: Variant }> = ({
    children,
    variant,
}) => {
    const severity = variant && VariantToSeverity[variant]

    return (
        <Box sx={{ mb: 4, mt: 2 }}>
            {severity ? (
                <Alert severity={severity}>
                    <Markdown markdown={children} />
                </Alert>
            ) : (
                <Markdown markdown={children} />
            )}
        </Box>
    )
}
