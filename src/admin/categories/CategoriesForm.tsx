import { FC, useState } from 'react'
import { Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { nanoid } from 'nanoid'
import { Button, Grid } from '@mui/material'
import { createTreeProps, treeQuery } from './tree-utils'

interface Category {
    id: string
    label: string
    children: Category[]
}

const mapCategoryToDataNode = ({
    id,
    label,
    children,
}: Category): DataNode => ({
    key: id,
    title: label,
    children: mapCategoriesToDataNodes(children),
})

const mapCategoriesToDataNodes = (categories: Category[]): DataNode[] =>
    categories.map(mapCategoryToDataNode)

const cat = (label: string, ...children: Category[]) => ({
    id: nanoid(),
    label,
    children,
})

export const CategoriesForm: FC = () => {
    const [treeData, setTreeData] = useState(
        mapCategoriesToDataNodes([
            cat(
                'Möbler',
                cat(
                    'Bord',
                    cat('Höj och sänkbara skrivbord'),
                    cat('Slaktbänkar')
                ),
                cat('Stolar')
            ),
        ])
    )
    const [expandedKeys, setExpandedKeys] = useState<DataNode['key'][]>([])
    const [selectedKey, setSelectedKey] = useState<DataNode['key']>('')

    const qt = treeQuery(
        treeData,
        (n) => n.key,
        (n) => n.children || []
    )
    const selected = qt.find(selectedKey)

    return (
        <Grid container>
            <Grid item sm={12} md={6}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        const newNode = mapCategoryToDataNode(
                            cat('Ny kategori')
                        )

                        if (selected) {
                            selected.children!.unshift(newNode)
                            setExpandedKeys([
                                ...new Set(expandedKeys),
                                selected.key,
                            ])
                            setTreeData([...treeData])
                        } else {
                            setTreeData([newNode, ...treeData])
                        }
                    }}
                >
                    Lägg till
                </Button>
                <Tree
                    style={{ fontSize: 'x-large' }}
                    {...createTreeProps({
                        selectedKey,
                        setSelectedKey,
                        treeData,
                        setTreeData,
                        expandedKeys,
                        setExpandedKeys,
                    })}
                />
            </Grid>
            <Grid item sm={12} md={6}>
                {selectedKey}
                <pre>
                    <code>{JSON.stringify(selected, null, 2)}</code>
                </pre>
            </Grid>
        </Grid>
    )
}
