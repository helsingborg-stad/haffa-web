import { interpolate } from './interpolate'

describe('interpolate', () => {
    it('substitues replacement variables', () => {
        expect(interpolate('{a}+{b}={c}', { a: '2', b: '3', c: '5' })).toBe(
            '2+3=5'
        )
    })

    it('ignores (leaves as is) unbound variables', () => {
        expect(interpolate('{missing}!!!', {})).toBe('{missing}!!!')
    })
})
