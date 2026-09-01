import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { createTreeAdapter } from 'lib/tree-adapter'
import { treeDetach, treeFind, treeFindReplace } from 'lib/tree-lookup'
import { getTreeNodeActions } from 'lib/tree-node-actions'
import type { Action1, Action2, Func1 } from 'lib/types'
import { uniqueBy } from 'lib/unique-by'
import { type ReactNode, useCallback, useEffect, useReducer } from 'react'

export interface TreeHookData<T> {
    nodes: T[]
    selectedNode: T | null
    treeViewProps: TreeViewProps
    renderTreeItems: Func1<T[], ReactNode>
    addNode: Action1<T>
    updateNode: Action2<T, Func1<T, Partial<T>>>
    removeNode: Action1<T>
    getNodeActions: Func1<T, TreeHookNodeActions>
    viewState?: TreeHookViewState
}

export type TreeHookNodeActions = Partial<{
    moveNodePrev: () => any
    moveNodeNext: () => any
    promoteNode: () => any
    demoteNode: () => any
}>

export interface TreeHookViewState {
    selectedKey: Key
    expandedKeys: Key[]
}

export interface TreeViewProps {
    expandedItems: string[]
    selectedItems: string | null
    onExpandedItemsChange: (
        event: React.SyntheticEvent | null,
        itemIds: string[]
    ) => void
    onSelectedItemsChange: (
        event: React.SyntheticEvent | null,
        itemId: string | null
    ) => void
}

type Key = string

interface Model<T> {
    initialized: boolean
    nodes: T[]
    selectedNode: T | null
    treeViewProps: TreeViewProps
    expandedKeys: Key[]
    dispatch: React.Dispatch<Func1<Model<T>, Partial<Model<T>>>>
}

const buildModel = <T,>(
    nodes: T[],
    keyFn: Func1<T, string>,
    childrenFn: Func1<T, T[]>,
    selectedKey: Key | null,
    expandedKeys: Key[],
    dispatch: Action1<Func1<Model<T>, Partial<Model<T>>>>
): Model<T> => {
    const selected = selectedKey
        ? treeFind(nodes, childrenFn, (n) => keyFn(n) === selectedKey)
        : null
    return {
        initialized: true,
        dispatch,
        nodes,
        selectedNode: selected ? selected.node : null,
        expandedKeys,
        treeViewProps: {
            expandedItems: expandedKeys,
            selectedItems: selected ? keyFn(selected.node) : null,
            onExpandedItemsChange: (_event, itemIds) =>
                dispatch(() => ({ expandedKeys: itemIds })),
            onSelectedItemsChange: (_event, itemId) =>
                dispatch(({ expandedKeys }) => {
                    const n = itemId
                        ? treeFind(
                              nodes,
                              childrenFn,
                              (n) => keyFn(n) === itemId
                          )?.node || null
                        : null
                    const expand: Partial<Model<T>> =
                        n && childrenFn(n).length > 0
                            ? {
                                  expandedKeys: [
                                      ...new Set([...expandedKeys, keyFn(n)]),
                                  ],
                              }
                            : {}
                    return {
                        selectedNode: n,
                        ...expand,
                    }
                }),
        },
    }
}

export const useTree = <T,>(
    initialNodes: T[],
    keyFn: Func1<T, string>,
    titleFn: Func1<T, ReactNode>,
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
                childrenFn,
                patch.selectedNode ? keyFn(patch.selectedNode) : null,
                patch.selectedNode
                    ? [
                          ...patch.expandedKeys,
                          ...createTreeAdapter(patch.nodes, keyFn, childrenFn)
                              .pathById(keyFn(patch.selectedNode))
                              .map((n) => keyFn(n)),
                          keyFn(patch.selectedNode),
                      ].filter(uniqueBy((k) => k))
                    : patch.expandedKeys,
                patch.dispatch
            )
            return x
        },
        {
            initialized: false,
            nodes: [],
            selectedNode: null,
            treeViewProps: {
                expandedItems: [],
                selectedItems: null,
                onExpandedItemsChange: () => {},
                onSelectedItemsChange: () => {},
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
    }, [
        model,
        viewState?.expandedKeys,
        viewState,
        keyFn,
        initialNodes,
        childrenFn,
    ])

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
        [model, childrenFn]
    )

    const renderTreeItems = useCallback(
        (nodes: T[]): ReactNode =>
            nodes.map((n) => {
                const children = childrenFn(n)
                return (
                    <TreeItem
                        key={keyFn(n)}
                        itemId={keyFn(n)}
                        label={titleFn(n)}
                    >
                        {children.length > 0 ? renderTreeItems(children) : null}
                    </TreeItem>
                )
            }),
        [keyFn, titleFn, childrenFn]
    )

    return {
        nodes: model.nodes,
        selectedNode: model.selectedNode,
        treeViewProps: model.treeViewProps,
        renderTreeItems,
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
        getNodeActions: (node) => {
            const createAction = (
                getAction: (
                    from: ReturnType<typeof getTreeNodeActions<T>>
                ) => undefined | (() => any)
            ) => {
                const indicative = getAction(
                    getTreeNodeActions(
                        model.nodes,
                        childrenFn,
                        (n) => n === node
                    )
                )
                if (!indicative) {
                    // action is initially not available
                    return undefined
                }
                return () =>
                    dispatch(({ nodes }) => {
                        // perform same action in reducer context
                        const action = getAction(
                            getTreeNodeActions(
                                nodes,
                                childrenFn,
                                (n) => n === node
                            )
                        )
                        action?.()
                        return { nodes: [...nodes] }
                    })
            }

            return {
                moveNodePrev: createAction(({ moveNodePrev }) => moveNodePrev),
                moveNodeNext: createAction(({ moveNodeNext }) => moveNodeNext),
                promoteNode: createAction(({ promoteNode }) => promoteNode),
                demoteNode: createAction(({ demoteNode }) => demoteNode),
            }
        },
    }
}
