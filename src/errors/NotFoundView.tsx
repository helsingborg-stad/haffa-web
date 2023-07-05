import { Layout } from 'layout'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const NotFoundView: FC = () => {
    const { ERROR_NOT_FOUND } = useContext(PhraseContext)
    return <Layout>{ERROR_NOT_FOUND}</Layout>
}
