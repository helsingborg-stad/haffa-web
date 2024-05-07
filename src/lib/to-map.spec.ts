import { toMap } from './to-map'

describe('toMap', () => {
    it('maps list to object', () => {
        expect(
            toMap(
                ['a', 'b', 'c'],
                (v) => `key ${v}`,
                (v) => `value ${v}`
            )
        ).toMatchObject({
            'key a': 'value a',
            'key b': 'value b',
            'key c': 'value c',
        })
    })
})
