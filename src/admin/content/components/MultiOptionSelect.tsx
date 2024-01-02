import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectProps,
    TextFieldProps,
} from '@mui/material'
import { useState } from 'react'
import { Option } from '../../../options/types'

export const MultiOptionSelect = (
    props: (SelectProps<string | string[]> & TextFieldProps) & {
        selected: string[]
        options: Option[]
        onUpdate: (value: string) => void
    }
) => {
    const { options, selected, onUpdate, ...rest } = props

    const [state, setState] = useState(selected)

    return (
        <FormControl fullWidth>
            <InputLabel id="multi-string-select">{props.label}</InputLabel>
            <Select
                {...rest}
                labelId="multi-string-select"
                multiple
                value={state}
                onChange={({ target: { value } }) => {
                    const result: string[] = (
                        typeof value === 'string' ? value.split(',') : value
                    ).filter((v) => v !== '')

                    setState(result)
                    onUpdate(result.join(','))
                }}
            >
                {options.map((t) => (
                    <MenuItem key={t.key} value={t.key}>
                        {t.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
