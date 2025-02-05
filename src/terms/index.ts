import { TermsContext, TermsProvider } from './TermsContext'
import { createNotifyingTermsRepository } from './repository/notifying-terms-repository'
import { createTermsRepository } from './repository/terms-repository'
import { Terms } from './types'

export { TermsContext, TermsProvider }
export { createTermsRepository, createNotifyingTermsRepository }

export const createEmptyTerms = (): Terms => ({
    places: [],
    organization: [],
    unit: [],
    material: [],
    condition: [],
    usage: [],
    tags: [],
    sizes: [],
})
