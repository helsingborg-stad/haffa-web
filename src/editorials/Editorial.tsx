import { Alert, AlertColor, Box } from '@mui/material'
import { Markdown } from 'components/Markdown'
import { PhraseContext } from 'phrases'
import { FC, useContext } from 'react'

export const Editorial: FC<{
    phraseKey: string
    children?: string
    templateVariables?: Record<string, string | number>
    severity?: AlertColor
}> = ({ phraseKey, children, templateVariables, severity }) => {
    const { phrase } = useContext(PhraseContext)

    const content = phrase(phraseKey, children || '', templateVariables)

    return (
        !!content && (
            <Box sx={{ mb: 4, mt: 2 }}>
                <Alert severity={severity || 'success'}>
                    <Markdown markdown={content} />
                </Alert>
            </Box>
        )
    )
}
