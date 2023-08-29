import { FC, useContext, useState } from 'react'
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
import { treeFind } from './tree-lookup'

const ROOT_CATEGORY_ID = 'root'

const cat = (c: Partial<Category>): Category => ({
    id: nanoid(),
    label: '',
    categories: [],
    ...c,
})

export const CategoriesForm: FC<{
    categories: Category[]
    viewState?: TreeHookViewState
    onSave: Action2<Category[], TreeHookViewState | undefined>
}> = ({ categories, viewState: initialViewState, onSave }) => {
    const { phrase } = useContext(PhraseContext)

    const [rootCategory] = useState(
        cat({
            id: ROOT_CATEGORY_ID,
            label: phrase('', 'Alla Kategorier (platshållare)'),
            categories,
        })
    )

    const {
        nodes,
        treeProps,
        viewState,
        selectedNode,
        addNode,
        updateNode,
        removeNode,
    } = useTree(
        [rootCategory],
        (c) => c.id,
        (c) => c.label,
        (c) => c.categories,
        initialViewState || {
            selectedKey: '',
            expandedKeys: [ROOT_CATEGORY_ID],
        }
    )
    const categoryTree = () => (
        <Tree style={{ fontSize: 'x-large' }} {...treeProps} />
    )
    const categoryEditor = () =>
        selectedNode &&
        selectedNode.id !== ROOT_CATEGORY_ID && (
            <TextField
                value={selectedNode.label}
                onChange={(e) =>
                    updateNode(selectedNode, () => ({
                        label: e.target.value,
                    }))
                }
            />
        )
    const categoryActions = () => {
        const canAddCategory = !!selectedNode
        const canRemoveCategory =
            !!selectedNode && selectedNode.id !== ROOT_CATEGORY_ID
        const canSave = categories && categories.length > 0
        const getUserCategories = () =>
            treeFind(
                nodes,
                (n) => n.categories,
                (n) => n.id === ROOT_CATEGORY_ID
            )?.node?.categories || []
        return (
            <ButtonGroup sx={{ ml: 'auto' }}>
                <Button
                    variant="outlined"
                    disabled={!canAddCategory}
                    onClick={() => addNode(cat({ label: 'Ny kategori' }))}
                >
                    {phrase('', 'Lägg till ny kategori')}
                </Button>
                <Button
                    variant="outlined"
                    disabled={!canRemoveCategory}
                    onClick={() => removeNode(selectedNode!)}
                >
                    {phrase('', 'Ta bort kategori')}
                </Button>
                <Button
                    disabled={!canSave}
                    onClick={() => onSave(getUserCategories(), viewState)}
                >
                    {phrase('', 'Spara')}
                </Button>
            </ButtonGroup>
        )
    }
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
