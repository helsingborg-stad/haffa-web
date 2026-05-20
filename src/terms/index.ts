import { createNotifyingTermsRepository } from './repository/notifying-terms-repository'
import { createTermsRepository } from './repository/terms-repository'
import { TermsContext, TermsProvider } from './TermsContext'
import type { Terms } from './types'

export {
    createNotifyingTermsRepository,
    createTermsRepository,
    TermsContext,
    TermsProvider,
}

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
