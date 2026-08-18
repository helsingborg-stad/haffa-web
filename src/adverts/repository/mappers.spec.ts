import { createEmptyAdvertInput, sanitizeAdvertInput } from './mappers'

describe('sanitizeAdvertInput', () => {
    it('keeps valid numeric fields as-is', () => {
        const input = sanitizeAdvertInput({
            ...createEmptyAdvertInput(),
            quantity: 3,
            lendingPeriod: 14,
            co2kg: 12,
            valueByUnit: 34,
        })
        expect(input).toMatchObject({
            quantity: 3,
            lendingPeriod: 14,
            co2kg: 12,
            valueByUnit: 34,
        })
    })

    it.each([
        ['', 0],
        [null, 0],
        [undefined, 0],
        ['not-a-number', 0],
        [NaN, 0],
    ])(
        'normalizes co2kg and valueByUnit %j to a finite default of %d',
        (value, fallback) => {
            const input = sanitizeAdvertInput({
                ...createEmptyAdvertInput(),
                co2kg: value as unknown as number,
                valueByUnit: value as unknown as number,
            })
            expect(input.co2kg).toBe(fallback)
            expect(input.valueByUnit).toBe(fallback)
            expect(Number.isFinite(input.co2kg)).toBe(true)
            expect(Number.isFinite(input.valueByUnit)).toBe(true)
        }
    )

    it('falls back a blank quantity to 1, not 0', () => {
        const input = sanitizeAdvertInput({
            ...createEmptyAdvertInput(),
            quantity: '' as unknown as number,
        })
        expect(input.quantity).toBe(1)
    })
})
