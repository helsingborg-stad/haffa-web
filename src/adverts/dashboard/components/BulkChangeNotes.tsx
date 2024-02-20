import { Box, Button, Stack, TextField } from '@mui/material'
import { AdvertInput } from 'adverts'
import { FC, useState } from 'react'

export const BulkChangeNotes: FC<{
    disabled: boolean
    onBulkUpdate: (patch: Partial<AdvertInput>) => void
}> = ({ disabled, onBulkUpdate }) => {
    const [value, setValue] = useState('')
    return (
        <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
                <TextField
                    multiline
                    fullWidth
                    rows={3}
                    label="Ändra notering på markerade annonser"
                    placeholder="Ändra notering på markerade annonser"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </Box>
            <Button
                disabled={disabled}
                onClick={() => onBulkUpdate({ notes: value })}
            >
                Utför
            </Button>
        </Stack>
    )
}
