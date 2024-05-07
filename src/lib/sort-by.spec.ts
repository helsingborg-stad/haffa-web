import { sortBy } from './sort-by'

describe('sortBy', () => {
    it('allows sorting using Array.sort', () => {
        expect([5, 2, 3, 10, 7].sort(sortBy((n) => n))).toMatchObject([
            2, 3, 5, 7, 10,
        ])
    })
})
