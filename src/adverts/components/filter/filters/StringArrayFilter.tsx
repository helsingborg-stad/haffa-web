import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material'
import { FC } from 'react'

const inputValueToStringArray = (value: any): string[] =>
    (Array.isArray(value) ? value : [value?.toString()]).filter((v) => v)

export const StringArrayFilter: FC<{
    label: string
    values: string[]
    selected: string[]
    onChange: (values: string[]) => void
}> = ({ label, values, selected, onChange }) => (
    <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
            fullWidth
            multiple
            value={selected}
            onChange={({ target: { value } }) =>
                onChange(inputValueToStringArray(value))
            }
            input={<OutlinedInput label={label} />}
            renderValue={(selected) => selected.join(', ')}
        >
            {values.map((value) => (
                <MenuItem key={value} value={value}>
                    <Checkbox checked={selected.includes(value)} />
                    <ListItemText primary={value} />
                </MenuItem>
            ))}
        </Select>
    </FormControl>
)
