import { FC } from 'react'
import { Tree } from 'antd'
import { Button, Grid, TextField } from '@mui/material'
import { Category } from 'categories/types'
import { useTree } from './use-tree'

/*
const cat = (label: string, ...categories: Category[]): Category => ({
    id: nanoid(),
    label,
    categories,
})
*/
export const CategoriesForm: FC<{ categories: Category[] }> = ({
    categories,
}) => {
    const { treeProps, selectedNode, mutateSelected } = useTree(
        categories,
        (c) => c.id,
        (c) => c.label,
        (c) => c.categories
    )
    return (
        <Grid container>
            <Grid item sm={12} md={6}>
                <Button variant="outlined" onClick={() => {}}>
                    Lägg till
                </Button>
                <Tree style={{ fontSize: 'x-large' }} {...treeProps} />
            </Grid>
            <Grid item sm={12} md={6}>
                {selectedNode && (
                    <TextField
                        value={selectedNode.label}
                        onChange={(e) =>
                            mutateSelected((s) => ({
                                ...s,
                                label: e.target.value,
                            }))
                        }
                    />
                )}
                <pre>
                    <code>{JSON.stringify(selectedNode, null, 2)}</code>
                </pre>
            </Grid>
        </Grid>
    )
}
