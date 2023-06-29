import { FC, useContext } from 'react'
import { PhraseContext } from './PhraseContext'

export const Phrase: FC<{ id: string; value: string }> = ({ id, value }) => {
    const { phrase } = useContext(PhraseContext)
    return <>{phrase(id, value)}</>
}
