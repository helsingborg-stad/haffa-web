import { FC, useCallback, useState } from 'react'
import { Tree } from 'antd'
import type { DataNode, TreeProps } from 'antd/es/tree'
import { nanoid } from 'nanoid'
import { Button, Grid, TextField } from '@mui/material'
import { Category } from 'categories/types'
import { Action1, Func1 } from 'lib/types'
import { NodeMatch, treeFind, treeFindMap, treeLookup } from './tree-lookup'

const mapCategoryToDataNode = ({
    id,
    label,
    categories,
}: Category): DataNode => ({
    key: id,
    title: label,
    children: mapCategoriesToDataNodes(categories),
})

const mapCategoriesToDataNodes = (categories: Category[]): DataNode[] =>
    categories.map(mapCategoryToDataNode)

const cat = (label: string, ...categories: Category[]): Category => ({
    id: nanoid(),
    label,
    categories,
})

const cloneTree = (tree: DataNode[]): DataNode[] =>
    tree.map(({ key, title, children }) => ({
        key,
        title,
        children: cloneTree(children || []),
    }))

type Key = DataNode['key']
interface Root {
    categoryMapping: Record<Key, Category>
    tree: DataNode[]
    expandedKeys: Key[]
    selectedNode: DataNode | null
}

export const createTreeProps = (
    root: Root & { mutateRoot: Action1<Func1<Root, Partial<Root>>> }
): TreeProps => {
    const { mutateRoot } = root
    const onSelect: TreeProps['onSelect'] = (_, info) =>
        mutateRoot(() => ({
            selectedNode: info.selected ? info.node : null,
        }))

    const onExpand: TreeProps['onExpand'] = (
        expandedKeys,
        { expanded, node: { key } }
    ) =>
        mutateRoot(() => ({
            expandedKeys: expanded
                ? [...expandedKeys, key]
                : expandedKeys.filter((k) => k !== key),
        }))

    const onDragEnter: TreeProps['onDragEnter'] = () => {}
    /*
    const onDragEnter: TreeProps['onDragEnter'] = ({ node }) =>
        mutateRoot(({ expandedKeys }) => ({
            expandedKeys: [...expandedKeys, node.key],
            // expandedKeys, set it when controlled is needed
            // setExpandedKeys(info.expandedKeys)
        }))
*/

    const onDrop: TreeProps['onDrop'] = (info) =>
        // mutateRoot(({ tree, expandedKeys }) => {
        mutateRoot(({ tree, expandedKeys }) => {
            const dropKey = info.node.key
            const dragKey = info.dragNode.key
            const dropPos = info.node.pos.split('-')
            const dropPosition =
                info.dropPosition - Number(dropPos[dropPos.length - 1])

            const visit = <R,>(
                key: Key,
                visitor: Func1<NodeMatch<DataNode>, R>
            ) =>
                treeFindMap(
                    tree,
                    (n) => n.children,
                    (n) => n.key === key,
                    visitor
                )

            const expkeys = new Set(expandedKeys)

            // Find dragobject and detach from tree
            const dragObj = visit(dragKey, ({ node, index, parent }) => {
                const pc = parent ? parent.children : tree
                pc?.splice(index, 1)
                return node
            })
            if (!dragObj) {
                return {}
            }

            if (!info.dropToGap) {
                // Drop on the content
                visit(dropKey, ({ node }) => {
                    // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                    node.children!.unshift(dragObj)
                    // set new parent to expanded
                    expkeys.add(node.key)
                })
            } else if (
                ((info.node as any).props.children || []).length > 0 && // Has children
                (info.node as any).props.expanded && // Is expanded
                dropPosition === 1 // On the bottom gap
            ) {
                visit(dropKey, ({ node }) => {
                    // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                    node.children!.unshift(dragObj)
                    // in previous version, we use item.children.push(dragObj) to insert the
                    // item to the tail of the children
                    // set new parent to expanded
                    expkeys.add(node.key)
                })
            } else {
                visit(dropKey, ({ index, parent }) => {
                    const pc = parent ? parent.children : tree
                    if (dropPosition === -1) {
                        pc?.splice(index, 0, dragObj!)
                    } else {
                        pc?.splice(index + 1, 0, dragObj!)
                    }
                })
            }
            return {
                expandedKeys: [...expkeys],
                tree: [...tree],
            }
        })
    return {
        treeData: root.tree,
        selectable: true,
        draggable: true,
        selectedKeys: root.selectedNode ? [root.selectedNode.key] : [],
        expandedKeys: root.expandedKeys,
        onSelect,
        onExpand,
        onDragEnter,
        onDrop,
    }
}

export const CategoriesForm: FC<{ categories: Category[] }> = ({
    categories,
}) => {
    const [root, setRoot] = useState<Root>(() => {
        const categoryMapping = treeLookup(
            categories,
            (c) => c.id,
            (c) => c.categories
        )
        const tree = mapCategoriesToDataNodes(categories)
        const expandedKeys = tree.map((n) => n.key)
        return {
            categoryMapping,
            tree,
            expandedKeys,
            selectedNode: null,
        }
    })
    const mutateRoot = useCallback(
        (mutate: Func1<Root, Partial<Root> | void>) =>
            setRoot({ ...root, ...mutate(root) }),
        [root, setRoot]
    )

    return (
        <Grid container>
            <Grid item sm={12} md={6}>
                <Button
                    variant="outlined"
                    onClick={() =>
                        mutateRoot(
                            ({ categoryMapping, tree, selectedNode }) => {
                                // create a new category
                                const c = cat('Ny kategori')
                                // eslint-disable-next-line no-param-reassign
                                categoryMapping[c.id] = c

                                // make a new node and insert into the tree
                                const n = mapCategoryToDataNode(c)

                                // insert into selected or as root
                                const children = selectedNode
                                    ? selectedNode.children
                                    : tree
                                children?.unshift(n)

                                return {
                                    selectedNode: n,
                                    tree: [...tree],
                                }
                            }
                        )
                    }
                >
                    Lägg till
                </Button>
                <Tree
                    style={{ fontSize: 'x-large' }}
                    {...createTreeProps({ ...root, mutateRoot })}
                />
            </Grid>
            <Grid item sm={12} md={6}>
                {root.selectedNode && (
                    <TextField
                        value={
                            root.categoryMapping[root.selectedNode.key].label
                        }
                        onChange={(e) =>
                            mutateRoot(
                                ({ tree, categoryMapping, selectedNode }) => {
                                    const { key } = selectedNode!
                                    const { value } = e.target
                                    const t = cloneTree(tree)
                                    const { node: sn } = treeFind(
                                        t,
                                        (n) => n.children,
                                        (n) => n.key === key
                                    )!
                                    sn.title = value
                                    return {
                                        tree: t,
                                        selectedNode: sn,
                                        categoryMapping: {
                                            ...categoryMapping,
                                            [key]: {
                                                ...categoryMapping[key],
                                                label: value,
                                            },
                                        },
                                    }
                                }
                            )
                        }
                    />
                )}
                <pre>
                    <code>{JSON.stringify(root.selectedNode, null, 2)}</code>
                </pre>
            </Grid>
        </Grid>
    )
}
