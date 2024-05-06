import { lazy } from './lazy'
import { treeLookup, treeVisit } from './tree-lookup'
import { Func1, TreeAdapter } from './types'

export const createNullTreeAdapter = <T>(): TreeAdapter<T> => ({
    rootNodes: [],
    allNodes: [],
    findById: () => null,
    pathById: () => [],
})

export const createTreeAdapter = <T>(
    nodes: T[],
    key: Func1<T, string>,
    children: Func1<T, T[]>
): TreeAdapter<T> => {
    const byId = lazy(() => treeLookup(nodes, key, children))
    const parentById = lazy(() => {
        const map: { [key: string]: T } = {}
        treeVisit(nodes, children, ({ node, parent }) => {
            if (parent) {
                map[key(node)] = parent
            }
        })
        return map
    })

    return {
        rootNodes: nodes,
        allNodes: Object.values(byId()),
        findById: (id) => byId()[id] || null,
        pathById: (id) => {
            let c = byId()[id]
            const l: T[] = []
            while (c) {
                l.unshift(c)
                c = parentById()[key(c)]
            }
            return l
        },
    }
}
