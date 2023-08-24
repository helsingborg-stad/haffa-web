import { DataNode, TreeProps } from 'antd/es/tree'
import { Dispatch } from 'react'

interface TreeStrategy {
    treeData: DataNode[]
    selectedKey: DataNode['key']
    setSelectedKey: Dispatch<DataNode['key']>
    expandedKeys: DataNode['key'][]
    setTreeData: Dispatch<DataNode[]>
    setExpandedKeys: Dispatch<DataNode['key'][]>
}

interface Func1<T, R> {
    (item: T): R
}
export const treeQuery = <T, K>(
    nodes: T[],
    getKey: Func1<T, K>,
    getChildren: Func1<T, T[]>
) => {
    const findRec = (
        nodes: T[],
        key: K
    ): { node: T; index: number; nodes: T[] } | null => {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < nodes.length; ++index) {
            const node = nodes[index]
            if (getKey(node) === key) {
                return { node, index, nodes }
            }
            const found = findRec(getChildren(node), key)
            if (found) {
                return found
            }
        }
        return null
    }

    const find = (key: K) => findRec(nodes, key)?.node || null
    const visit = (
        key: K,
        visitor: (node: T, index: number, nodes: T[]) => any
    ) => {
        const found = findRec(nodes, key)
        return found ? visitor(found.node, found.index, found.nodes) : null
    }
    return {
        find,
        visit,
    }
}

export const createTreeProps = ({
    treeData,
    selectedKey,
    setSelectedKey,
    expandedKeys,
    setTreeData,
    setExpandedKeys,
}: TreeStrategy): TreeProps => {
    const onSelect: TreeProps['onSelect'] = (_, info) => {
        if (info.selected) {
            setSelectedKey(info.node.key)
        } else {
            setSelectedKey('')
        }
    }
    const onExpand: TreeProps['onExpand'] = (keys, info) => {
        const { key } = info.node
        info.expanded
            ? setExpandedKeys([...keys, key])
            : setExpandedKeys(keys.filter((k) => k !== key))
    }

    const onDragEnter: TreeProps['onDragEnter'] = (info) => {
        console.log(info)
        // expandedKeys, set it when controlled is needed
        // setExpandedKeys(info.expandedKeys)
    }

    const onDrop: TreeProps['onDrop'] = (info) => {
        console.log(info)
        const dropKey = info.node.key
        const dragKey = info.dragNode.key
        const dropPos = info.node.pos.split('-')
        const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1])

        const ekeys = new Set<DataNode['key']>(expandedKeys)

        const data = [...treeData]
        const { visit } = treeQuery(
            data,
            (n) => n.key,
            (n) => n.children || []
        )

        // Find dragObject
        let dragObj: DataNode
        visit(dragKey, (item, index, arr) => {
            arr.splice(index, 1)
            dragObj = item
        })

        if (!info.dropToGap) {
            // Drop on the content
            visit(dropKey, (item) => {
                // eslint-disable-next-line no-param-reassign
                item.children = item.children || []
                // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                item.children.unshift(dragObj)
                // set new parent to expanded
                ekeys.add(item.key)
            })
        } else if (
            ((info.node as any).props.children || []).length > 0 && // Has children
            (info.node as any).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            visit(dropKey, (item) => {
                // eslint-disable-next-line no-param-reassign
                item.children = item.children || []
                // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                item.children.unshift(dragObj)
                // in previous version, we use item.children.push(dragObj) to insert the
                // item to the tail of the children
                // set new parent to expanded
                ekeys.add(item.key)
            })
        } else {
            let ar: DataNode[] = []
            let i: number
            visit(dropKey, (_item, index, arr) => {
                ar = arr
                i = index
            })
            if (dropPosition === -1) {
                ar.splice(i!, 0, dragObj!)
            } else {
                ar.splice(i! + 1, 0, dragObj!)
            }
        }
        setTreeData(data)
        setExpandedKeys([...ekeys])
    }
    return {
        treeData,
        selectable: true,
        draggable: true,
        selectedKeys: selectedKey ? [selectedKey] : [],
        expandedKeys,
        onSelect,
        onExpand,
        onDragEnter,
        onDrop,
    }
}
