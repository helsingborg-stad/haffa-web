import type { Option } from './types'

export const getOption = <T = string>(
    key: T,
    options: Option[]
): string | undefined => options.find((option) => option.key === key)?.value

export const objectToOptions = <T extends string>(
    obj: Record<T, string>
): Option<T>[] =>
    Object.entries(obj).map(([key, value]) => ({ key, value } as Option<T>))

export const optionsToObject = <T extends string>(
    options: Option<T>[]
): Partial<Record<T, string>> =>
    options.reduce(
        (p, c) => ({
            ...p,
            [c.key]: c.value,
        }),
        {}
    )
