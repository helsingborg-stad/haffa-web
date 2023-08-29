import { TreeProps } from 'antd'
import { DataNode } from 'antd/es/tree'
import { Action1, Action2, Action3, Func1 } from 'lib/types'
import { useCallback, useEffect, useReducer } from 'react'
import { treeDetach, treeFind, treeFindReplace } from './tree-lookup'

export interface TreeHookData<T> {
    nodes: T[]
    selectedNode: T | null
    treeProps: TreeProps
    addNode: Action1<T>
    updateNode: Action2<T, Func1<T, Partial<T>>>
    removeNode: Action1<T>
    viewState?: TreeHookViewState
}

export interface TreeHookViewState {
    selectedKey: Key
    expandedKeys: Key[]
}

interface Model<T> {
    initialized: boolean
    nodes: T[]
    selectedNode: T | null
    treeProps: TreeProps
    expandedKeys: Key[]
    dispatch: React.Dispatch<Func1<Model<T>, Partial<Model<T>>>>
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
        } else if (
            ((info.node as any).props.children || []).length > 0 && // Has children
            (info.node as any).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            move(dropKey, dragObj, 0)
        } else {
            move(dropKey, dragObj, dropPosition)
        }
    }
    return {
        treeData: tree,
        selectable: true,
        draggable: true,
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

const buildModel = <T>(
    nodes: T[],
    keyFn: Func1<T, string>,
    titleFn: Func1<T, string>,
    childrenFn: Func1<T, T[]>,
    selectedKey: Key | null,
    expandedKeys: Key[],
    dispatch: Action1<Func1<Model<T>, Partial<Model<T>>>>
): Model<T> => {
    const tree = makeTree(nodes, keyFn, titleFn, childrenFn)
    const selected = selectedKey
        ? treeFind(nodes, childrenFn, (n) => keyFn(n) === selectedKey)
        : null
    return {
        initialized: true,
        dispatch,
        nodes,
        selectedNode: selected ? selected.node : null,
        expandedKeys,
        treeProps: {
            expandedKeys,
            selectedKeys: selected ? [keyFn(selected.node)] : [],
            ...createTreeHandlerProps({
                tree,
                select: (key, selected) => {
                    dispatch(() => {
                        const n = selected
                            ? treeFind(
                                  nodes,
                                  childrenFn,
                                  (n) => keyFn(n) === key
                              )?.node || null
                            : null
                        return {
                            selectedNode: n,
                        }
                    })
                },
                expand: (key, expanded) =>
                    dispatch(({ expandedKeys }) => ({
                        expandedKeys: expanded
                            ? [...expandedKeys, key]
                            : expandedKeys.filter((k) => k !== key),
                    })),
                move: (key, node: T, index: number) =>
                    dispatch(({ nodes }) => {
                        // detach node before re-attaching
                        if (treeDetach(nodes, childrenFn, (n) => n === node)) {
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
        },
    }
}

export const useTree = <T>(
    initialNodes: T[],
    keyFn: Func1<T, string>,
    titleFn: Func1<T, string>,
    childrenFn: Func1<T, T[]>,
    viewState?: TreeHookViewState
): TreeHookData<T> => {
    const [model, dispatch] = useReducer(
        (root: Model<T>, mutate: Func1<Model<T>, Partial<Model<T>>>) => {
            const patch: Model<T> = {
                ...root,
                ...mutate(root),
            }
            const x: Model<T> = buildModel(
                patch.nodes,
                keyFn,
                titleFn,
                childrenFn,
                patch.selectedNode ? keyFn(patch.selectedNode) : null,
                patch.expandedKeys,
                patch.dispatch
            )
            return x
        },
        {
            initialized: false,
            nodes: [],
            selectedNode: null,
            treeProps: {
                treeData: [],
            },
            expandedKeys: [],
            dispatch: (root) => root,
        }
    )

    useEffect(() => {
        if (!model.initialized) {
            let init: Partial<Model<T>> = {}
            if (viewState) {
                init = {
                    selectedNode:
                        treeFind(
                            initialNodes,
                            childrenFn,
                            (n) => keyFn(n) === viewState.selectedKey
                        )?.node || null,
                    expandedKeys: viewState.expandedKeys,
                }
            }
            dispatch(() => ({
                initialized: true,
                nodes: initialNodes,
                ...init,
                dispatch,
            }))
        }
    }, [model, dispatch])

    const replaceNode = useCallback(
        (node: T, mutator: Func1<T, Partial<T>>) => {
            treeFindReplace(
                model.nodes,
                childrenFn,
                (n) => n === node,
                (n) => ({
                    ...n,
                    ...mutator(n),
                })
            )
        },
        [model]
    )

    return {
        nodes: model.nodes,
        selectedNode: model.selectedNode,
        treeProps: model.treeProps,
        viewState: {
            selectedKey: model.selectedNode ? keyFn(model.selectedNode) : '',
            expandedKeys: model.expandedKeys,
        },
        addNode: (newNode) =>
            dispatch(({ selectedNode, nodes, expandedKeys }) => {
                if (selectedNode) {
                    replaceNode(selectedNode, (n) => {
                        const copy = { ...n }
                        childrenFn(copy).unshift(newNode)
                        return copy
                    })
                    return {
                        nodes: [...nodes],
                        expandedKeys: [
                            ...new Set([...expandedKeys, keyFn(selectedNode)]),
                        ],
                        selectedNode: newNode,
                    }
                }
                return {
                    nodes: [newNode, ...nodes],
                    selectedNode: newNode,
                }
            }),
        updateNode: (node, mutate) =>
            dispatch(({ nodes }) => {
                treeFindReplace(
                    nodes,
                    childrenFn,
                    (n) => n === node,
                    (n) => ({
                        ...n,
                        ...mutate(n),
                    })
                )
                return { nodes: [...nodes] }
            }),
        removeNode: (node) =>
            dispatch(({ nodes }) => {
                treeDetach(nodes, childrenFn, (n) => n === node)
                return {
                    nodes: [...nodes],
                }
            }),
    }
}
