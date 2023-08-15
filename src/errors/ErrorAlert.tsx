import { FC, useContext } from 'react'
import { Alert } from '@mui/material'
import { renderError } from '.'
import { PhraseContext } from '../phrases/PhraseContext'

export const ErrorAlert: FC<{ error: any }> = ({ error }) => {
    const { ERROR_NOT_FOUND, ERROR_UNKNOWN, ERROR_UNAUTHORIZED } =
        useContext(PhraseContext)
    console.error({ error })
    return renderError(error, {
        notFound: () => <Alert severity="error">{ERROR_NOT_FOUND}</Alert>,
        unathorized: () => <Alert severity="error">{ERROR_UNAUTHORIZED}</Alert>,
        default: () => <Alert severity="error">{ERROR_UNKNOWN}</Alert>,
    })
}
