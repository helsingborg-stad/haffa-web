import { treeLookup } from './tree-lookup'
import { Func1, TreeAdapter } from './types'

export const createTreeAdapter = <T>(
    nodes: T[],
    key: Func1<T, string>,
    children: Func1<T, T[]>
): TreeAdapter<T> => {
    const byId = treeLookup(nodes, key, children)

    return {
        findById: (id) => byId[id] || null,
    }
}
