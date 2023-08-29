import { FC, useContext } from 'react'
import { Tree } from 'antd'
import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    Grid,
    TextField,
} from '@mui/material'
import { Category } from 'categories/types'
import { nanoid } from 'nanoid'
import { PhraseContext } from 'phrases/PhraseContext'
import { Action2 } from 'lib/types'
import { TreeHookViewState, useTree } from './use-tree'

const cat = (label: string, ...categories: Category[]): Category => ({
    id: nanoid(),
    label,
    categories,
})

export const CategoriesForm: FC<{
    categories: Category[]
    viewState?: TreeHookViewState
    onSave: Action2<Category[], TreeHookViewState | undefined>
}> = ({ categories, viewState: initialViewState, onSave }) => {
    const { phrase } = useContext(PhraseContext)

    const {
        nodes,
        treeProps,
        viewState,
        selectedNode,
        addNode,
        updateNode,
        removeNode,
    } = useTree(
        categories,
        (c) => c.id,
        (c) => c.label,
        (c) => c.categories,
        initialViewState
    )
    const categoryTree = () => (
        <Tree style={{ fontSize: 'x-large' }} {...treeProps} />
    )
    const categoryEditor = () =>
        selectedNode && (
            <TextField
                value={selectedNode.label}
                onChange={(e) =>
                    updateNode(selectedNode, () => ({
                        label: e.target.value,
                    }))
                }
            />
        )
    const categoryActions = () => (
        <ButtonGroup sx={{ ml: 'auto' }}>
            <Button
                variant="outlined"
                onClick={() => addNode(cat('Ny kategori'))}
            >
                {phrase('', 'Lägg till ny kategori')}
            </Button>
            <Button
                variant="outlined"
                disabled={!selectedNode}
                onClick={() => removeNode(selectedNode!)}
            >
                {phrase('', 'Ta bort kategori')}
            </Button>
            <Button onClick={() => onSave(nodes, viewState)}>
                {phrase('', 'Spara')}
            </Button>
        </ButtonGroup>
    )
    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item sm={12} md={6}>
                        {categoryTree()}
                    </Grid>
                    <Grid item sm={12} md={6}>
                        {categoryEditor()}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>{categoryActions()}</CardActions>
        </Card>
    )
}
