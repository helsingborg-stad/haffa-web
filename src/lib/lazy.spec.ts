import { lazy } from './lazy'

describe('lazy(factory) => getter', () => {
    it('evaluates factory lazy', () => {
        let factoryCalls = 0
        // eslint-disable-next-line no-plusplus
        const v = lazy(() => ++factoryCalls)

        // factory should not be called yet
        expect(factoryCalls).toBe(0)

        expect(v()).toBe(1 /* === factiryCalls */)
        expect(v()).toBe(1 /* === factiryCalls */)
    })
})
