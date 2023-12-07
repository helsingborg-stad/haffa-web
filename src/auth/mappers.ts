import { toMap } from 'lib/to-map'
import { HaffaUserRoles } from './types'

export const hasSomeAdminRoles = (r: HaffaUserRoles): boolean =>
    !!(
        r.canEditApiKeys ||
        r.canEditSystemCategories ||
        r.canEditSystemLoginPolicies ||
        r.canEditTerms ||
        r.canRunSystemJobs ||
        r.canSeeSystemStatistics
    )

export const rolesToRolesArray = (roles?: HaffaUserRoles) =>
    Object.entries(normalizeRoles(roles))
        .filter(([, enabled]) => enabled)
        .map(([roleName]) => roleName)

export const rolesArrayToRoles = (roles: string[]): HaffaUserRoles =>
    Array.isArray(roles)
        ? normalizeRoles(
              toMap(
                  roles,
                  (role) => role,
                  () => true
              )
          )
        : {}

export const normalizeRoles = (
    roles?: HaffaUserRoles
): Required<HaffaUserRoles> => ({
    canEditOwnAdverts: !!roles?.canEditOwnAdverts,
    canArchiveOwnAdverts: !!roles?.canArchiveOwnAdverts,
    canRemoveOwnAdverts: !!roles?.canRemoveOwnAdverts,
    canReserveAdverts: !!roles?.canReserveAdverts,
    canCollectAdverts: !!roles?.canCollectAdverts,
    canManageOwnAdvertsHistory: !!roles?.canManageOwnAdvertsHistory,
    canSubscribe: !!roles?.canSubscribe,
    canManageAllAdverts: !!roles?.canManageAllAdverts,
    canEditSystemCategories: !!roles?.canEditSystemCategories,
    canEditSystemLoginPolicies: !!roles?.canEditSystemLoginPolicies,
    canEditApiKeys: !!roles?.canEditApiKeys,
    canEditTerms: !!roles?.canEditTerms,
    canRunSystemJobs: !!roles?.canRunSystemJobs,
    canSeeSystemStatistics: !!roles?.canSeeSystemStatistics,
    canManageContent: !!roles?.canManageContent,
})
