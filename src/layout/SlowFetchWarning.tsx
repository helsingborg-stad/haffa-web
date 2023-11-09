import { Alert, SxProps, Theme } from '@mui/material'
import useSomeFetchIsSlow from 'hooks/fetch/use-some-fetch-is-slow'
import { PhraseContext } from 'phrases'
import { FC, useContext } from 'react'

export const SlowFetchWarning: FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
    const hasSlowFetch = useSomeFetchIsSlow()
    const { INFO_SLOW_CONNECTION } = useContext(PhraseContext)
    return hasSlowFetch ? (
        <Alert key="sf" sx={sx} severity="warning">
            {INFO_SLOW_CONNECTION}
        </Alert>
    ) : null
}
