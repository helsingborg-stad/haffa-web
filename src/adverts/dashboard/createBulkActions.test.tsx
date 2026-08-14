import { type AdvertClaim, AdvertClaimType } from 'adverts/types'
import { describe, expect, it, vi } from 'vitest'
import { createBulkActions } from './createBulkActions'

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

const makeContext = ({
    claims = [],
    canEditOwnAdverts = true,
    collectClaimsManually = vi.fn(),
    cancelCollectedClaims = vi.fn(),
}: {
    claims?: AdvertClaim[]
    canEditOwnAdverts?: boolean
    collectClaimsManually?: () => any
    cancelCollectedClaims?: () => any
} = {}) =>
    ({
        phrase: (_key: string, defaultTemplate: string) => defaultTemplate,
        roles: { canEditOwnAdverts },
        fields: {},
        selectionMatches: (predicate: (advert: any) => boolean) =>
            predicate({ meta: { claims } }),
        archiveAdverts: vi.fn(),
        unarchiveAdverts: vi.fn(),
        markAdvertsAsPicked: vi.fn(),
        markAdvertsAsUnpicked: vi.fn(),
        createAdvertLabels: vi.fn(),
        collectClaimsManually,
        cancelCollectedClaims,
    }) as unknown as Parameters<typeof createBulkActions>[0]

const getAction = (context: ReturnType<typeof makeContext>) =>
    createBulkActions(context).find(
        ({ key }) => key === 'collect-claims-manually'
    )

describe('createBulkActions - collect-claims-manually', () => {
    it('is not included when the user lacks canEditOwnAdverts', () => {
        const context = makeContext({
            canEditOwnAdverts: false,
            claims: [makeClaim()],
        })

        expect(getAction(context)).toBeUndefined()
    })

    it('has the expected label and icon', () => {
        const action = getAction(makeContext({ claims: [makeClaim()] }))

        expect(action?.label).toBe('Lämna ut manuellt')
        expect(action?.icon).toBeTruthy()
    })

    it('is enabled when exactly one convertible claim exists', () => {
        const action = getAction(makeContext({ claims: [makeClaim()] }))

        expect(action?.enabled()).toBe(true)
    })

    it('is disabled when there are no claims', () => {
        const action = getAction(makeContext({ claims: [] }))

        expect(action?.enabled()).toBe(false)
    })

    it('is disabled when there is more than one convertible claim', () => {
        const action = getAction(
            makeContext({ claims: [makeClaim(), makeClaim()] })
        )

        expect(action?.enabled()).toBe(false)
    })

    it('is disabled when the claim cannot be converted', () => {
        const action = getAction(
            makeContext({ claims: [makeClaim({ canConvert: false })] })
        )

        expect(action?.enabled()).toBe(false)
    })

    it('is disabled when the claim is already collected', () => {
        const action = getAction(
            makeContext({
                claims: [makeClaim({ type: AdvertClaimType.collected })],
            })
        )

        expect(action?.enabled()).toBe(false)
    })

    it('invokes collectClaimsManually when triggered', () => {
        const collectClaimsManually = vi.fn()
        const action = getAction(
            makeContext({ claims: [makeClaim()], collectClaimsManually })
        )

        action?.action()

        expect(collectClaimsManually).toHaveBeenCalledTimes(1)
    })
})

const getCancelAction = (context: ReturnType<typeof makeContext>) =>
    createBulkActions(context).find(
        ({ key }) => key === 'cancel-collected-claims'
    )

describe('createBulkActions - cancel-collected-claims', () => {
    it('is not included when the user lacks canEditOwnAdverts', () => {
        const context = makeContext({
            canEditOwnAdverts: false,
            claims: [makeClaim({ type: AdvertClaimType.collected })],
        })

        expect(getCancelAction(context)).toBeUndefined()
    })

    it('has the expected label and icon', () => {
        const action = getCancelAction(
            makeContext({
                claims: [makeClaim({ type: AdvertClaimType.collected })],
            })
        )

        expect(action?.label).toBe('Ångra hämtning')
        expect(action?.icon).toBeTruthy()
    })

    it('is enabled when exactly one cancelable collected claim exists', () => {
        const action = getCancelAction(
            makeContext({
                claims: [makeClaim({ type: AdvertClaimType.collected })],
            })
        )

        expect(action?.enabled()).toBe(true)
    })

    it('is disabled when there are no claims', () => {
        const action = getCancelAction(makeContext({ claims: [] }))

        expect(action?.enabled()).toBe(false)
    })

    it('is disabled when there is more than one cancelable collected claim', () => {
        const action = getCancelAction(
            makeContext({
                claims: [
                    makeClaim({ type: AdvertClaimType.collected }),
                    makeClaim({ type: AdvertClaimType.collected }),
                ],
            })
        )

        expect(action?.enabled()).toBe(false)
    })

    it('is disabled when the claim cannot be canceled', () => {
        const action = getCancelAction(
            makeContext({
                claims: [
                    makeClaim({
                        type: AdvertClaimType.collected,
                        canCancel: false,
                    }),
                ],
            })
        )

        expect(action?.enabled()).toBe(false)
    })

    it('is disabled when the claim is not collected', () => {
        const action = getCancelAction(makeContext({ claims: [makeClaim()] }))

        expect(action?.enabled()).toBe(false)
    })

    it('invokes cancelCollectedClaims when triggered', () => {
        const cancelCollectedClaims = vi.fn()
        const action = getCancelAction(
            makeContext({
                claims: [makeClaim({ type: AdvertClaimType.collected })],
                cancelCollectedClaims,
            })
        )

        action?.action()

        expect(cancelCollectedClaims).toHaveBeenCalledTimes(1)
    })
})
