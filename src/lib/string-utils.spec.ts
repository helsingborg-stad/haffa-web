import {
    isValidStringOr,
    isValidString,
    isValidUrl,
    isValidColor,
} from './string-utils'

describe('isValidUrl', () => {
    it('should accept common url-patterns', () => {
        const list = [
            'https://www.google.se',
            'http://www.google.se',
            'https://www.google.se/path',
            'https://www.google.se/?path=path',
        ]
        list.forEach((u) => expect(isValidUrl(u)).toBe(true))
    })
    it('should deny invalid url-patterns', () => {
        const list = [
            'https://',
            'http://',
            'file://google.se',
            'mailto:',
            'tel:',
            'www.google.se',
            'https://a b',
            '/google.se',
            '',
        ]
        list.forEach((u) => expect(isValidUrl(u)).toBe(false))
    })
})

describe('isValidString', () => {
    it('should accept valid strings', () => {
        const list = ['A valid string']
        list.forEach((u) => expect(isValidString(u)).toBe(true))
    })
    it('should deny invalid strings', () => {
        const list = [undefined, null, '']
        list.forEach((u) => expect(isValidString(u)).toBe(false))
    })
})

describe('isValidStringOr', () => {
    it('should accept valid strings', () => {
        const list = ['A valid string']
        list.forEach((u) => expect(isValidStringOr(u, '')).toBe(u))
    })
    it('should return default value', () => {
        const list = [undefined, null, '']
        list.forEach((u) =>
            expect(isValidStringOr(u, 'DEFAULT')).toBe('DEFAULT')
        )
    })
})

describe('isValidColor', () => {
    it('should accept valid strings', () => {
        const list = [
            // Capital and small letters
            '#aA18ef',
            // Shorthand syntax
            '#999',
            '#abc',
        ]
        list.forEach((u) => expect(isValidColor(u)).toBe(true))
    })
    it('should deny invalid strings', () => {
        const list = [
            undefined,
            null,
            '',
            // Letters not hex
            '#aA99BG',
            // Missing #
            'aabbcc',
            // Invalid shorthand syntax
            '#4565',
        ]
        list.forEach((u) => expect(isValidColor(u)).toBe(false))
    })
})
