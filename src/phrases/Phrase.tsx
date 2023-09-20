import { FC, useContext } from 'react'
import { PhraseContext } from './PhraseContext'

export const Phrase: FC<{
    id: string
    value: string
    variables?: Record<string, string | number>
}> = ({ id, value, variables }) => {
    const { phrase } = useContext(PhraseContext)
    return <>{phrase(id, value, variables)}</>
}
