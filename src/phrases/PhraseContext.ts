import { createContext } from 'react'
import { PhraseContextType } from './types'
import { createPhraseContext } from './create-phrase-context'

export const PhraseContext = createContext<PhraseContextType>(
    createPhraseContext({})
)
