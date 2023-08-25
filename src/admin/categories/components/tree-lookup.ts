import { Action1, Func1 } from 'lib/types'

export interface NodeMatch<T> {
    node: T
    index: number
    parent: T | null
}
const treeVisitImpl = <T>(
    parent: T | null,
    nodes: T[],
    children: Func1<T, T[] | null | undefined>,
    visitor: Action1<{ node: T; index: number; parent: T | null }>
): void =>
    nodes.forEach(
        (node, index) => (
            visitor({ node, index, parent }),
            treeVisitImpl(node, children(node) || [], children, visitor)
        )
    )

export const treeVisit = <T>(
    nodes: T[],
    children: Func1<T, T[] | null | undefined>,
    visitor: Action1<{ node: T; index: number; parent: T | null }>
): void => treeVisitImpl(null, nodes, children, visitor)

const treeFindImpl = <T>(
    parent: T | null,
    nodes: T[],
    children: Func1<T, T[] | null | undefined>,
    match: Func1<T, boolean>
): NodeMatch<T> | null => {
    const index = nodes.findIndex(match)
    if (index >= 0) {
        return { node: nodes[index], index, parent }
    }
    return nodes.reduce<NodeMatch<T> | null>(
        (found, node) =>
            found || treeFindImpl(node, children(node) || [], children, match),
        null
    )
}
export const treeFind = <T>(
    nodes: T[],
    children: Func1<T, T[] | null | undefined>,
    match: Func1<T, boolean>
): NodeMatch<T> | null => treeFindImpl(null, nodes, children, match)

export const treeFindMap = <T, R>(
    nodes: T[],
    children: Func1<T, T[] | null | undefined>,
    match: Func1<T, boolean>,
    map: Func1<NodeMatch<T>, R>
): R | null => {
    const found = treeFind(nodes, children, match)
    return found ? map(found) : null
}

export const treeLookup = <T, K extends string | number>(
    nodes: T[],
    key: Func1<T, K>,
    children: Func1<T, T[]>
): Record<K, T> => {
    const lookup: Record<K, T> = {} as Record<K, T>
    treeVisit(nodes, children, ({ node }) => {
        lookup[key(node)] = node
    })
    return lookup
}
