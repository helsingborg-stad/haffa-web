import { FC, useContext, useState } from 'react'
import { Tree } from 'antd'
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material'
import { Category } from 'categories/types'
import { nanoid } from 'nanoid'
import { PhraseContext } from 'phrases/PhraseContext'
import { Action2 } from 'lib/types'
import { treeFind } from 'lib/tree-lookup'
import { TreeHookViewState, useTree } from './use-tree'

const ROOT_CATEGORY_ID = 'root'

const cat = (c: Partial<Category>): Category => ({
    id: nanoid(),
    label: '',
    co2kg: 0,
    categories: [],
    advertCount: 0,
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
    const countAdverts = (c: Category): number =>
        (c.advertCount || 0) +
        c.categories.reduce((s, c) => s + countAdverts(c), 0)

    const categoryTitle = (c: Category) => {
        if (c.id === ROOT_CATEGORY_ID) {
            return c.label
        }
        if ((c.advertCount || 0) > 0) {
            return (
                <Badge
                    badgeContent={c.advertCount}
                    color="info"
                    overlap="rectangular"
                    sx={{ pr: 1 }}
                >
                    {c.label}
                </Badge>
            )
            return <span>{c.label} *</span>
        }
        return c.label
    }
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
        (c) => categoryTitle(c),
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
            <Stack spacing={2}>
                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        label={phrase('', 'Benämning')}
                        placeholder={phrase('', 'Benämning')}
                        value={selectedNode.label}
                        onChange={(e) =>
                            updateNode(selectedNode, () => ({
                                label: e.target.value,
                            }))
                        }
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        label={phrase('', 'CO₂ besparing')}
                        placeholder={phrase('', 'CO₂ besparing')}
                        type="number"
                        value={selectedNode.co2kg}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    kg
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) =>
                            updateNode(selectedNode, () => ({
                                co2kg: Math.max(
                                    0,
                                    parseInt(e.target.value, 10) || 0
                                ),
                            }))
                        }
                    />
                </FormControl>
            </Stack>
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
