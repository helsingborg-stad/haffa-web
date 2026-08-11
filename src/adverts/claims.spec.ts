import {
    getManuallyCollectableClaims,
    isManuallyCollectableClaim,
} from './claims'
import { type AdvertClaim, AdvertClaimType } from './types'

const makeClaim = (overrides: Partial<AdvertClaim> = {}): AdvertClaim => ({
    quantity: 1,
    by: 'someone@example.com',
    at: '2026-01-01T00:00:00.000Z',
    type: AdvertClaimType.reserved,
    events: [],
    canCancel: true,
    canConvert: true,
    isOverdue: false,
    ...overrides,
})

describe('isManuallyCollectableClaim', () => {
    it('is true for a convertible, non-collected claim', () => {
        expect(isManuallyCollectableClaim(makeClaim())).toBe(true)
    })

    it('is false when the claim cannot be converted', () => {
        expect(
            isManuallyCollectableClaim(makeClaim({ canConvert: false }))
        ).toBe(false)
    })

    it('is false when the claim is already collected', () => {
        expect(
            isManuallyCollectableClaim(
                makeClaim({ type: AdvertClaimType.collected })
            )
        ).toBe(false)
    })
})

describe('getManuallyCollectableClaims', () => {
    it('keeps only manually collectable claims', () => {
        const eligible = makeClaim()
        const notConvertible = makeClaim({ canConvert: false })
        const alreadyCollected = makeClaim({ type: AdvertClaimType.collected })

        expect(
            getManuallyCollectableClaims([
                eligible,
                notConvertible,
                alreadyCollected,
            ])
        ).toEqual([eligible])
    })

    it('returns an empty array when nothing is eligible', () => {
        expect(
            getManuallyCollectableClaims([
                makeClaim({ canConvert: false }),
                makeClaim({ type: AdvertClaimType.collected }),
            ])
        ).toEqual([])
    })
})
