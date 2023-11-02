import { Alert, Container } from '@mui/material'
import useSomeFetchIsSlow from 'hooks/fetch/use-some-fetch-is-slow'
import { PhraseContext } from 'phrases'
import { FC, useContext } from 'react'

export const SlowFetchWarning: FC = () => {
    const hasSlowFetch = useSomeFetchIsSlow()
    const { INFO_SLOW_CONNECTION } = useContext(PhraseContext)
    return hasSlowFetch ? (
        <Container key="sf">
            <Alert severity="warning">{INFO_SLOW_CONNECTION}</Alert>
        </Container>
    ) : null
}
