import { createContext, type FC, type PropsWithChildren } from 'react'
import type { TermsRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`TermsContext::${method} is not provided`)
}

export const TermsContext = createContext<TermsRepository>({
    getTerms: notProvided('getTerms'),
    updateTerms: notProvided('updateTerms'),
})

export const TermsProvider: FC<
    PropsWithChildren<{ repository: TermsRepository }>
> = ({ repository, children }) => (
    <TermsContext.Provider value={repository}>{children}</TermsContext.Provider>
)
