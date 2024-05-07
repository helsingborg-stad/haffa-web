import { uniqueBy } from './unique-by'

describe('uniqueBy', () => {
    it('allows restricting using Array.filter', () => {
        const data = (key: string) => ({ key })
        const list = [
            data('a'),
            data('b'),
            data('c'),
            data('a'),
            data('c'),
            data('a'),
            data('b'),
            data('d'),
        ]

        expect(list.filter(uniqueBy((d) => d.key))).toMatchObject([
            list[0],
            list[1],
            list[2],
            list[7],
        ])
    })
})
