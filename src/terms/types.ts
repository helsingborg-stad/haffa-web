export interface Terms {
    organization: string[]
    unit: string[]
    material: string[]
    condition: string[]
    usage: string[]
    tags: string[]
    sizes: string[]
}

export interface TermsRepository {
    getTerms: () => Promise<Terms>
    updateTerms: (terms: Terms) => Promise<Terms>
}
