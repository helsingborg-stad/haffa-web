import { treeLookup } from './tree-lookup'
import { Func1, TreeAdapter } from './types'

export const createTreeAdapter = <T>(
    nodes: T[],
    key: Func1<T, string>,
    parentKey: Func1<T, string>,
    children: Func1<T, T[]>
): TreeAdapter<T> => {
    const byId = treeLookup(nodes, key, children)

    return {
        findById: (id) => byId[id] || null,
        pathById: (id) => {
            let c = byId[id]
            const l: T[] = []
            while (c) {
                l.unshift(c)
                c = byId[parentKey(c)]
            }
            return l
        },
    }
}
