import { FC, useContext } from 'react'
import { UnauthorizedView } from 'auth/components/UnathorizedView'
import { Editorial } from 'editorials'
import { renderError } from '.'
import { Layout } from '../layout'
import { PhraseContext } from '../phrases/PhraseContext'

export const ErrorView: FC<{ error: any }> = ({ error }) => {
    const { ERROR_NOT_FOUND, ERROR_UNKNOWN } = useContext(PhraseContext)
    console.error({ error })
    return renderError(error, {
        notFound: () => (
            <Layout>
                <Editorial phraseKey="ERROR_NOT_FOUND">
                    {ERROR_NOT_FOUND}
                </Editorial>
            </Layout>
        ),
        // eslint-disable-next-line react/jsx-no-undef
        unathorized: () => <UnauthorizedView />,
        default: () => (
            <Layout>
                <Editorial phraseKey="ERROR_UNKNOWN">{ERROR_UNKNOWN}</Editorial>
            </Layout>
        ),
    })
}
