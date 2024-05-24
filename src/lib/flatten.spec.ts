import { flatten } from './flatten'

describe('flatten', () => {
    it('flatten flattens arrays of arays to an arrye of said individyal items', () => {
        expect(flatten([])).toMatchObject([])
        expect(flatten([[], [], [], []])).toMatchObject([])
        expect(flatten([[1, 2], [], [3], [4, 5]])).toMatchObject([
            1, 2, 3, 4, 5,
        ])
    })
})
