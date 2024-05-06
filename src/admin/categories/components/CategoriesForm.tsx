import { FC, useContext, useState } from 'react'
import { Tree } from 'antd'
import {
    Alert,
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
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { TreeHookViewState, useTree } from './use-tree'

const ROOT_CATEGORY_ID = 'root'

const cat = (c: Partial<Category>): Category => ({
    id: nanoid(),
    parentId: '',
    label: '',
    co2kg: 0,
    valueByUnit: 0,
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
            label: phrase(
                'CATEGORIES_ALL_PLACEHOLDER',
                'Alla Kategorier (platshållare)'
            ),
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
        getNodeActions,
    } = useTree(
        [rootCategory],
        (c) => c.id,
        (c) => categoryTitle(c),
        (c) => c.categories,
        initialViewState || {
            selectedKey: ROOT_CATEGORY_ID,
            expandedKeys: [ROOT_CATEGORY_ID],
        }
    )
    const categoryTree = () => (
        <Tree style={{ fontSize: 'x-large' }} {...treeProps} />
    )
    const categoryEditor = () => {
        const advertCount = selectedNode ? countAdverts(selectedNode) : 0
        const {
            moveNodePrev,
            moveNodeNext,
            promoteNode: promoteNodeRaw,
            demoteNode,
        } = selectedNode
            ? getNodeActions(selectedNode)
            : {
                  moveNodePrev: undefined,
                  moveNodeNext: undefined,
                  promoteNode: undefined,
                  demoteNode: undefined,
              }
        const promoteNode =
            selectedNode && rootCategory.categories.includes(selectedNode)
                ? undefined
                : promoteNodeRaw
        return (
            selectedNode &&
            selectedNode.id !== ROOT_CATEGORY_ID && (
                <Stack spacing={2}>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            label={phrase(
                                'CATEGORIES_FIELD_LABEL',
                                'Benämning'
                            )}
                            placeholder={phrase(
                                'CATEGORIES_FIELD_LABEL',
                                'Benämning'
                            )}
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
                            label={phrase(
                                'CATEGORIES_FIELD_C02',
                                'CO₂ besparing'
                            )}
                            placeholder={phrase(
                                'CATEGORIES_FIELD_C02',
                                'CO₂ besparing'
                            )}
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
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            label={phrase(
                                'CATEGORIES_FIELD_VALUE',
                                'Kostnadsvärdering'
                            )}
                            placeholder={phrase(
                                'CATEGORIES_FIELD_VALUE',
                                'Kostnadsvärdering'
                            )}
                            type="number"
                            value={selectedNode.valueByUnit}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        kr
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) =>
                                updateNode(selectedNode, () => ({
                                    valueByUnit: Math.max(
                                        0,
                                        parseInt(e.target.value, 10) || 0
                                    ),
                                }))
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <ButtonGroup>
                            <Button
                                disabled={!moveNodePrev}
                                onClick={moveNodePrev}
                            >
                                Flytta upp
                            </Button>
                            <Button
                                disabled={!moveNodeNext}
                                onClick={moveNodeNext}
                            >
                                Flytta ned
                            </Button>
                            <Button
                                disabled={!promoteNode}
                                onClick={promoteNode}
                            >
                                Gör överordnad
                            </Button>
                            <Button disabled={!demoteNode} onClick={demoteNode}>
                                Gör underordnad
                            </Button>
                        </ButtonGroup>
                    </FormControl>
                    {advertCount > 0 && (
                        <Alert>
                            {phrase(
                                'CATEGORIES_INFO_CONECTED_ADVERTS',
                                'Denna kategori har {count} kopplade annonser',
                                { count: advertCount }
                            )}
                        </Alert>
                    )}
                </Stack>
            )
        )
    }
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

        const advertCount = selectedNode ? countAdverts(selectedNode) : 0
        return (
            <ButtonGroup sx={{ ml: 'auto' }}>
                <Button
                    variant="outlined"
                    disabled={!canAddCategory}
                    onClick={() => addNode(cat({ label: 'Ny kategori' }))}
                >
                    {phrase('CATEGORIES_ADD', 'Lägg till ny kategori')}
                </Button>
                <Button
                    variant="outlined"
                    color={advertCount > 0 ? 'warning' : 'primary'}
                    disabled={!canRemoveCategory}
                    onClick={() => removeNode(selectedNode!)}
                >
                    {phrase('CATEGORIES_REMOVE', 'Ta bort kategori')}
                </Button>
                <Button
                    disabled={!canSave}
                    variant="contained"
                    onClick={() => onSave(getUserCategories(), viewState)}
                >
                    {phrase('CATEGORIES_SAVE', 'Spara')}
                </Button>
            </ButtonGroup>
        )
    }
    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_CATEGORIES_HEADLINE"
                body="ADMIN_CATEGORIES_BODY"
            />

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
        </>
    )
}
