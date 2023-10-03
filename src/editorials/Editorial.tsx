import { Alert, AlertColor, Box } from '@mui/material'
import { Markdown } from 'components/Markdown'
import { FC } from 'react'

export const Editorial: FC<{ children: string; severity?: AlertColor }> = ({
    children,
    severity,
}) => (
    <Box sx={{ mb: 4, mt: 2 }}>
        <Alert severity={severity || 'success'}>
            <Markdown markdown={children} />
        </Alert>
    </Box>
)
