import { Box, Divider, Typography } from '@mui/material'
import { PhraseContext } from 'phrases'
import { useContext } from 'react'

export const AdminEditorialPanel = (props: {
    headline: string
    body: string
    useDivider?: boolean
}) => {
    const { headline, body, useDivider = false } = props
    const { phrase } = useContext(PhraseContext)

    return (
        <Box>
            <Typography variant="h5" align="center" gutterBottom>
                {phrase(headline, headline)}
            </Typography>
            <Typography align="center" sx={{ mb: 2 }}>
                {phrase(body, body)}
            </Typography>
            {useDivider && <Divider />}
        </Box>
    )
}
