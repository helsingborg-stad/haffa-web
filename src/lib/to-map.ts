export const toMap = <T, V>(
    list: T[],
    keyFn: (item: T) => string,
    valueFn: (item: T) => V
): Record<string, V> =>
    Object.fromEntries(list.map((item) => [keyFn(item), valueFn(item)]))
