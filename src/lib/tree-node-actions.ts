import { treeFind } from './tree-lookup'
import { Func1 } from './types'

type TreeNodeActions = Partial<{
    moveNodePrev: () => any
    moveNodeNext: () => any
    promoteNode: () => any
    demoteNode: () => any
}>

export const getTreeNodeActions = <T>(
    nodes: T[],
    children: Func1<T, T[]>,
    match: Func1<T, boolean>
): TreeNodeActions => {
    const found = treeFind(nodes, children, match)
    if (!found) {
        return {}
    }
    const { index, parent, node } = found
    const siblings = parent ? children(parent) : []

    const moveNodePrev: TreeNodeActions['moveNodePrev'] =
        index > 0
            ? () => {
                  siblings.splice(index, 1)
                  siblings.splice(index - 1, 0, node)
              }
            : undefined

    const moveNodeNext: TreeNodeActions['moveNodeNext'] =
        index < siblings.length - 1
            ? () => {
                  siblings.splice(index, 1)
                  siblings.splice(index + 1, 0, node)
              }
            : undefined

    const promoteNode: TreeNodeActions['promoteNode'] = parent
        ? () => {
              const foundparent = treeFind(nodes, children, (n) => n === parent)
              if (foundparent && foundparent.parent) {
                  const parentsiblings = children(foundparent.parent) || []
                  siblings.splice(index, 1)
                  parentsiblings.splice(parentsiblings.length, 0, node)
              }
          }
        : undefined

    const demoteNode: TreeNodeActions['demoteNode'] =
        index > 0
            ? () => {
                  siblings.splice(index, 1)
                  const siblingchildren = children(siblings[index - 1]) || []
                  siblingchildren.splice(siblingchildren.length, 0, node)
              }
            : undefined

    return { moveNodeNext, moveNodePrev, promoteNode, demoteNode }
}
