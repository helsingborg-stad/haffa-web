import { FC, useContext } from 'react'
import { PhraseContext } from './PhraseContext'

export const Phrase: FC<{key: string, value: string}> = ({ key, value }) => {
	const { phrase } = useContext(PhraseContext)
	return <>{phrase(key, value)}</>
}