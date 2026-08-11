import { type AdvertClaim, AdvertClaimType } from './types'

export const isManuallyCollectableClaim = (claim: AdvertClaim): boolean =>
    claim.canConvert && claim.type !== AdvertClaimType.collected

export const getManuallyCollectableClaims = (
    claims: AdvertClaim[]
): AdvertClaim[] => claims.filter(isManuallyCollectableClaim)
