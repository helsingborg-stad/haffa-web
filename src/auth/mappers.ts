import { toMap } from 'lib/to-map'
import { HaffaUserRoles } from './types'

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
    canManageAllAdverts: !!roles?.canManageAllAdverts,
    canEditSystemCategories: !!roles?.canEditSystemCategories,
    canEditSystemLoginPolicies: !!roles?.canEditSystemLoginPolicies,
    canRunSystemJobs: !!roles?.canRunSystemJobs,
})
