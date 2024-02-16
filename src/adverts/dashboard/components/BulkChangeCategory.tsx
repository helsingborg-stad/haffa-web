import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from '@mui/material'
import { AdvertInput } from 'adverts'
import { Category } from 'categories/types'
import { sortBy } from 'lib/sort-by'
import { TreeAdapter } from 'lib/types'
import { FC, useState } from 'react'

export const BulkChangeCategory: FC<{
    disabled: boolean
    categoryTree: TreeAdapter<Category>
    onBulkUpdate: (patch: Partial<AdvertInput>) => void
}> = ({ disabled, categoryTree: { allNodes, pathById }, onBulkUpdate }) => {
    const [selected, setSelected] = useState('')
    return (
        <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                    <InputLabel>
                        Ändra kategori på markerade annonser
                    </InputLabel>
                    <Select
                        disabled={disabled}
                        fullWidth
                        value={selected}
                        label="Kategori"
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        {[
                            { id: '', label: '(Ingen kategori)' },
                            ...allNodes
                                .map((c) => ({
                                    id: c.id,
                                    label: pathById(c.id)
                                        .map(({ label }) => label)
                                        .join(' - '),
                                }))
                                .sort(
                                    sortBy(({ label }) => label.toLowerCase())
                                ),
                        ].map(({ id, label }) => (
                            <MenuItem key={id} value={id}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Button
                disabled={disabled}
                onClick={() => onBulkUpdate({ category: selected })}
            >
                Utför
            </Button>
        </Stack>
    )
}
