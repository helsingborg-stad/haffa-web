import { createProductionPhraseContext } from 'phrases/create-phrase-context'

describe('phrase(key, template)', () => {
    it('phrase(unknown key, S) => S', () => {
        const { phrase } = createProductionPhraseContext({})
        expect(phrase('unknown-key', 'ad hoc')).toBe('ad hoc')
    })
    it('phrase(known key K, S) => value of config[K]', () => {
        const { phrase } = createProductionPhraseContext({})

        expect(phrase('APP_TITLE', 'overriden template')).toBe('Haffa!')
    })
    it('overwriting config', () => {
        const { phrase } = createProductionPhraseContext({
            APP_TITLE: 'New title',
        })
        expect(phrase('APP_TITLE', 'overriden template')).toBe('New title')
    })
    it('additional config', () => {
        const { phrase } = createProductionPhraseContext({
            GIZMO: 'The Gizmo!',
        })
        expect(phrase('GIZMO', 'overriden template')).toBe('The Gizmo!')
    })

    it('allows interpolation', () => {
        const { phrase } = createProductionPhraseContext({
            GIZMO_COUNT: 'Number of Gizmos is {count}',
        })
        expect(phrase('GIZMO_COUNT', 'overriden template', { count: 4 })).toBe(
            'Number of Gizmos is 4'
        )
    })
})
