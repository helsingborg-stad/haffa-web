import { FC, useCallback, useState } from 'react'
import { sortBy } from 'lib/sort-by'
import { uniqueBy } from 'lib/unique-by'
import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material'
import { AdminActionPanel } from 'components/AdminActionPanel'
import type { Option } from '../../options/types'

export const EditTagDescriptionsForm: FC<{
    tags: string[]
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ tags, options, onUpdate }) => {
    const [model, setModel] = useState(() =>
        [
            // existing descriptions
            ...options.sort(sortBy((o) => o.key.toLowerCase())),
            // viable descriptions
            ...tags
                .map<Option>((tag) => ({
                    key: tag,
                    value: '',
                }))
                .sort(sortBy((o) => o.key.toLowerCase())),
        ].filter(uniqueBy((o) => o.key))
    )

    const mutateModelRow = useCallback(
        (index: number, patch: Partial<Option>) =>
            setModel(
                model.map((o, i) => (i === index ? { ...o, ...patch } : o))
            ),
        [model, setModel]
    )

    return (
        <Stack direction="column" spacing={2}>
            {model.map(({ key, value }, index) => (
                <Card key={key}>
                    <CardHeader title={key} />
                    <CardContent>
                        <TextField
                            value={value}
                            multiline
                            fullWidth
                            onChange={(e) =>
                                mutateModelRow(index, { value: e.target.value })
                            }
                        />
                    </CardContent>
                </Card>
            ))}
            <AdminActionPanel onSave={() => onUpdate(model)} />
        </Stack>
    )
}
