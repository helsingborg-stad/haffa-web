import { range } from './range'

describe('range()', () => {
    it('range(a, b) => [a,...,b]', () => {
        expect(range(17, 17)).toMatchObject([17])
        expect(range(3, 6)).toMatchObject([3, 4, 5, 6])

        expect(range(11, 2)).toMatchObject([])
    })
})
