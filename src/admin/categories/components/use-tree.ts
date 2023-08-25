import { TreeProps } from 'antd'
import { DataNode } from 'antd/es/tree'
import { Action1, Action2, Action3, Func1 } from 'lib/types'
import { useCallback, useState } from 'react'
import { treeDetach, treeFind, treeFindReplace } from './tree-lookup'

export interface TreeHookData<T> {
    nodes: T[]
    selectedNode: T | null
    treeProps: TreeProps
    mutateNodes: Action1<Func1<T[], T[]>>
    mutateSelected: Action1<Func1<T, T>>
}

type Key = string | number

const createTreeHandlerProps = <T>({
    tree,
    expand,
    select,
    move,
    find,
}: {
    tree: DataNode[]
    select: Action2<Key, boolean>
    expand: Action2<Key, boolean>
    move: Action3<Key, T, number>
    find: Func1<Key, T | null>
}): TreeProps => {
    const onSelect: TreeProps['onSelect'] = (_, { selected, node: { key } }) =>
        select(key, selected)

    const onExpand: TreeProps['onExpand'] = (_, { expanded, node: { key } }) =>
        expand(key, expanded)

    const onDragEnter: TreeProps['onDragEnter'] = () => {}
    /*
	const onDragEnter: TreeProps['onDragEnter'] = ({ node }) =>
			mutateRoot(({ expandedKeys }) => ({
					expandedKeys: [...expandedKeys, node.key],
					// expandedKeys, set it when controlled is needed
					// setExpandedKeys(info.expandedKeys)
			}))
*/

    const onDrop: TreeProps['onDrop'] = (info) => {
        const dropKey = info.node.key
        const dragKey = info.dragNode.key
        const dropPos = info.node.pos.split('-')
        const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1])

        // Find dragobject and detach from tree
        const dragObj = find(dragKey)
        if (!dragObj) {
            return {}
        }

        if (!info.dropToGap) {
            // Drop on the content
            move(dropKey, dragObj, 0)
            /*
                visit(dropKey, ({ node }) => {
                    // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                    node.children!.unshift(dragObj)
                    // set new parent to expanded
                    expkeys.add(node.key)
                })
								*/
        } else if (
            ((info.node as any).props.children || []).length > 0 && // Has children
            (info.node as any).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            move(dropKey, dragObj, 0)
            /*
                visit(dropKey, ({ node }) => {
                    // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                    node.children!.unshift(dragObj)
                    // in previous version, we use item.children.push(dragObj) to insert the
                    // item to the tail of the children
                    // set new parent to expanded
                    expkeys.add(node.key)
                })
								*/
        } else {
            move(dropKey, dragObj, dropPosition)
            /*
                visit(dropKey, ({ index, parent }) => {
                    const pc = parent ? parent.children : tree
                    if (dropPosition === -1) {
                        pc?.splice(index, 0, dragObj!)
                    } else {
                        pc?.splice(index + 1, 0, dragObj!)
                    }
                })
								*/
        }
    }
    return {
        treeData: tree,
        selectable: true,
        draggable: true,
        // treeData: root.tree,
        // selectable: true,
        // draggable: true,
        // selectedKeys: root.selectedNode ? [root.selectedNode.key] : [],
        // expandedKeys: root.expandedKeys,
        onSelect,
        onExpand,
        onDragEnter,
        onDrop,
    }
}

const makeTree = <T>(
    nodes: T[],
    key: Func1<T, string>,
    title: Func1<T, string>,
    children: Func1<T, T[]>
): DataNode[] =>
    nodes.map((n) => ({
        key: key(n),
        title: title(n),
        children: makeTree(children(n), key, title, children),
    }))

export const useTree = <T>(
    nodes: T[],
    keyFn: Func1<T, string>,
    titleFn: Func1<T, string>,
    childrenFn: Func1<T, T[]>
): TreeHookData<T> => {
    interface Root {
        nodes: T[]
        selectedNode: T | null
        treeProps: TreeProps
        expandedKeys: Key[]
    }
    const buildRoot = (
        nodes: T[],
        selectedKey: Key | null,
        expandedKeys: Key[]
    ): Root => {
        const tree = makeTree(nodes, keyFn, titleFn, childrenFn)
        const selected = selectedKey
            ? treeFind(nodes, childrenFn, (n) => keyFn(n) === selectedKey)
            : null
        return {
            nodes,
            selectedNode: selected ? selected.node : null,
            expandedKeys,
            treeProps: createTreeHandlerProps({
                tree,
                select: (key, selected) =>
                    mutateRoot(() => {
                        if (selected) {
                            const s = treeFind(
                                nodes,
                                childrenFn,
                                (n) => keyFn(n) === key
                            )
                            if (s) {
                                return {
                                    selectedNode: s.node,
                                }
                            }
                        }
                        return {
                            selectedNode: null,
                        }
                    }),
                expand: (key, expanded) =>
                    mutateRoot(({ expandedKeys }) => ({
                        expandedKeys: expanded
                            ? [...expandedKeys, key]
                            : expandedKeys.filter((k) => k !== key),
                    })),
                move: (key, node: T, index: number) =>
                    mutateRoot(({ nodes }) => {
                        // detach node before re-attaching
                        if (treeDetach(nodes, childrenFn, (n) => n === node)) {
                            console.log({
                                key,
                                index,
                            })

                            const parent = treeFind(
                                nodes,
                                childrenFn,
                                (n) => keyFn(n) === key
                            )
                            const pc = parent ? childrenFn(parent.node) : nodes
                            if (index < 1) {
                                pc?.splice(index, 0, node)
                            } else {
                                pc?.splice(index + 1, 0, node)
                            }
                            return {
                                nodes: [...nodes],
                            }
                        }
                        return {}
                    }),
                find: (key) =>
                    treeFind(nodes, childrenFn, (n) => keyFn(n) === key)
                        ?.node || null,
            }),
        }
    }

    const [root, setRoot] = useState<Root>(() => buildRoot(nodes, null, []))
    const mutateRoot = useCallback(
        (m: Func1<Root, Partial<Root>>) => {
            console.log(m(root))
            const u = {
                ...root,
                ...m(root),
            }
            setRoot(
                buildRoot(
                    u.nodes,
                    u.selectedNode ? keyFn(u.selectedNode) : null,
                    u.expandedKeys
                )
            )
        },
        [root, setRoot]
    )

    return {
        nodes: root.nodes,
        selectedNode: root.selectedNode,
        treeProps: root.treeProps,
        mutateNodes: (mutator) =>
            mutateRoot(({ nodes }) => ({
                nodes: mutator(nodes),
            })),
        mutateSelected: (mutator) =>
            mutateRoot(({ nodes, selectedNode }) => {
                treeFindReplace(
                    nodes,
                    childrenFn,
                    (n) => n === selectedNode,
                    mutator
                )
                return {}
            }),
    }
}
