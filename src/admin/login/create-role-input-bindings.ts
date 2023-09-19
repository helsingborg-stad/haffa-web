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
