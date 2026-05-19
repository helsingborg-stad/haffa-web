import { createContext } from 'react'
import { createPhraseContext } from './create-phrase-context'
import type { PhraseContextType } from './types'

export const PhraseContext = createContext<PhraseContextType>(
    createPhraseContext({})
)
