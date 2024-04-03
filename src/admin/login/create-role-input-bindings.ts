import { HaffaUserRoles } from 'auth'
import { PhraseContextType } from 'phrases'

interface RoleMappingBuilder<TRoles> {
    define: (
        prop: keyof TRoles,
        label: string,
        isAdmin?: boolean
    ) => RoleMappingBuilder<TRoles>
}

type RoleInputTuple<TRoles> = [keyof TRoles, string, boolean]

interface MapInputValueToRoles<TRoles> {
    (values: string | string[]): Partial<TRoles>
}

interface MapRolesToInputValue<TRoles> {
    (roles: Partial<TRoles>): string[]
}

interface MapInputValueToTuples<TRoles> {
    (values: string | string[]): RoleInputTuple<TRoles>[]
}

const makeTuple = <TRoles>(
    prop: keyof TRoles,
    label: string,
    isAdmin: boolean
): RoleInputTuple<TRoles> => [prop, label, isAdmin]

export const createRoleInputBindings = <TRoles>(
    definer: (builder: RoleMappingBuilder<TRoles>) => RoleMappingBuilder<TRoles>
): [
    RoleInputTuple<TRoles>[],
    MapInputValueToTuples<TRoles>,
    MapRolesToInputValue<TRoles>,
    MapInputValueToRoles<TRoles>
] => {
    const tuples: RoleInputTuple<TRoles>[] = []
    const builder: RoleMappingBuilder<TRoles> = {
        define: (prop, label, isAdmin) => {
            tuples.push(makeTuple(prop, label, !!isAdmin))
            return builder
        },
    }

    definer(builder)

    const labelsByKey = tuples.reduce(
        (m, [prop, label]) => ({
            ...m,
            [prop]: label,
        }),
        {} as { [Property in keyof TRoles]: string }
    )
    const isAdminByKey = tuples.reduce(
        (m, [prop, _, isAdmin]) => ({
            ...m,
            [prop]: isAdmin,
        }),
        {} as { [Property in keyof TRoles]: boolean }
    )

    const toArray = <T>(a: T | T[]): T[] => (Array.isArray(a) ? a : [a])

    const mapInputValueToTuples: MapInputValueToTuples<TRoles> = (
        values: string | string[]
    ) =>
        toArray(values).map((prop) =>
            makeTuple<TRoles>(
                prop as keyof TRoles,
                labelsByKey[prop as keyof TRoles],
                isAdminByKey[prop as keyof TRoles]
            )
        )

    const toInputValue = (roles: Partial<TRoles>): string[] =>
        tuples.map(([prop]) => roles[prop] && prop).filter((s) => s) as string[]

    //    const mapInputValue = (values: string||string[], mapper: )

    const fromInputValue = (values: string | string[]): Partial<TRoles> =>
        toArray(values)
            .filter((v) => v)
            .map((v) => v as keyof TRoles)
            .reduce((m, v) => ({ ...m, [v]: true }), {} as Partial<TRoles>)

    return [tuples, mapInputValueToTuples, toInputValue, fromInputValue]
}

export const createDefaultRoleInputBindings = (
    phrase: PhraseContextType['phrase']
) =>
    createRoleInputBindings<HaffaUserRoles>((b) =>
        b
            .define(
                'canEditOwnAdverts',
                phrase('ROLES_CAN_EDIT_OWN_ADVERTS', 'Skapa annonser')
            )
            .define(
                'canArchiveOwnAdverts',
                phrase(
                    'ROLES_CAN_ARCHIVE_OWN_ADVERTS',
                    'Arkivera egna annonser'
                )
            )
            .define(
                'canRemoveOwnAdverts',
                phrase('ROLES_CAN_REMOVE_OWN_ADVERTS', 'Ta bort egna annonser')
            )
            .define(
                'canReserveAdverts',
                phrase('ROLES_CAN_RESERVE_ADVERTS', 'Reservera annonser')
            )
            .define(
                'canCollectAdverts',
                phrase('ROLES_CAN_COLLECT_ADVERTS', 'Hämta ut annonser')
            )
            .define(
                'canSubscribe',
                phrase('ROLES_CAN_SUBSCRIBE', 'Bevaka annonser')
            )
            .define(
                'canJoinWaitlist',
                phrase('ROLES_CAN_JOIN_WAITLIST', 'Vänta på annons')
            )
            .define(
                'canManageOwnAdvertsHistory',
                phrase(
                    'ROLES_CAN_MANAGE_OWN_ADVERTS_HISTORY',
                    'Hantera egna annonsers historik'
                )
            )
            .define(
                'canManageAllAdverts',
                phrase(
                    'ROLES_CAN_MANAGE_ALL_ADVERTS',
                    'Hantera egna och andras annonser (admin)'
                ),
                true
            )
            .define(
                'canManageReturns',
                phrase(
                    'ROLES_CAN_MANAGE_RETURNS',
                    'Hantera återlämningar (admin)'
                ),
                true
            )
            .define(
                'canEditTerms',
                phrase('ROLES_CAN_EDIT_TERMS', 'Hantera definitioner (admin)'),
                true
            )
            .define(
                'canEditSystemCategories',
                phrase(
                    'ROLES_CAN_EDIT_SYSTEM_CATEGORIES',
                    'Hantera system kategorier (admin)'
                ),
                true
            )
            .define(
                'canEditSystemLoginPolicies',
                phrase(
                    'ROLES_CAN_EDIT_SYSTEM_LOGIN_POLICIES',
                    'Hantera systemets användare & behörigheter (admin)'
                ),
                true
            )
            .define(
                'canEditApiKeys',
                phrase('ROLES_CAN_EDIT_API_KEYS', 'Hantera API nycklar'),
                true
            )
            .define(
                'canSeeSystemStatistics',
                phrase(
                    'ROLES_CAN_SEE_SYSTEM_STATISTICS',
                    'Se statistikunderlag'
                ),
                true
            )
            .define(
                'canRunSystemJobs',
                phrase(
                    'ROLES_CAN_RUN_SYSTEM_JOBS',
                    'Agent som får köra jobb (admin)'
                ),
                true
            )
            .define(
                'canManageContent',
                phrase('ROLES_CAN_MANAGE_CONTENT', 'Managera innehåll (admin)'),
                true
            )
            .define(
                'canManageLocations',
                phrase(
                    'ROLES_CAN_MANAGE_LOCATIONS',
                    'Managera adressregistret (admin)'
                ),
                true
            )
            .define(
                'canManageNotifications',
                phrase(
                    'ROLES_CAN_MANAGE_NOTIFICATIONS',
                    'Managera notifikationer (admin)'
                ),
                true
            )
    )
