import { FC, useContext } from 'react'
import { Tree } from 'antd'
import { Box, Button, Grid, TextField } from '@mui/material'
import { Category } from 'categories/types'
import { nanoid } from 'nanoid'
import { PhraseContext } from 'phrases/PhraseContext'
import { Action1 } from 'lib/types'
import { useTree } from './use-tree'

const cat = (label: string, ...categories: Category[]): Category => ({
    id: nanoid(),
    label,
    categories,
})

export const CategoriesForm: FC<{
    categories: Category[]
    onSave: Action1<Category[]>
}> = ({ categories, onSave }) => {
    const { phrase } = useContext(PhraseContext)

    const { nodes, treeProps, selectedNode, addNode, updateNode, removeNode } =
        useTree(
            categories,
            (c) => c.id,
            (c) => c.label,
            (c) => c.categories
        )
    return (
        <Grid container>
            <Grid item sm={12} md={6}>
                <Tree style={{ fontSize: 'x-large' }} {...treeProps} />
            </Grid>
            <Grid item sm={12} md={6}>
                <Button
                    variant="outlined"
                    onClick={() => addNode(cat('Ny kategori'))}
                >
                    {phrase('', 'Lägg till ny kategori')}
                </Button>

                {selectedNode && (
                    <Box>
                        <TextField
                            value={selectedNode.label}
                            onChange={(e) =>
                                updateNode(selectedNode, () => ({
                                    label: e.target.value,
                                }))
                            }
                        />
                    </Box>
                )}
                {selectedNode && (
                    <Button onClick={() => removeNode(selectedNode)}>
                        {phrase('', 'Ta bort kategori')}
                    </Button>
                )}
                <Button onClick={() => onSave(nodes)}>
                    {phrase('', 'Spara')}
                </Button>
                <pre>
                    <code>{JSON.stringify(selectedNode, null, 2)}</code>
                </pre>
            </Grid>
        </Grid>
    )
}
