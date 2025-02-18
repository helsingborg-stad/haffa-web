import { byMatchingTags } from './by-matching-tags'

describe('byMatchingTags', () => {
    it('should return false if no matching tags', () => {
        expect(
            byMatchingTags([])({
                tag: '',
            })
        ).toBe(false)
        expect(
            byMatchingTags([])({
                tag: 'tag1',
            })
        ).toBe(false)
        expect(
            byMatchingTags(['tag3', 'tag2', 'tag1'])({
                tag: 'tag4',
            })
        ).toBe(false)
    })

    it('should return true if matching tags', () => {
        expect(
            byMatchingTags(['tag1'])({
                tag: 'tag1',
            })
        ).toBe(true)
        expect(
            byMatchingTags(['tag3', 'tag2', 'tag1'])({
                tag: 'tag2',
            })
        ).toBe(true)
    })
})
