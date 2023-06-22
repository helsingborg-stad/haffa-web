import { createContext } from 'react'

export interface PhraseContextType {
	phrase: (key: string, defaultValue: string) => string
}
export const PhraseContext = createContext<PhraseContextType>({
	phrase: (key, v) => v,
})