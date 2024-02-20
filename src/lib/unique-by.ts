import { Func1 } from './types'

export const uniqueBy = <T, K>(key: Func1<T, K>): Func1<T, boolean> => {
    const found = new Set<K>()
    return (item: T) => {
        const k = key(item)
        if (found.has(k)) {
            return false
        }
        found.add(k)
        return true
    }
}
