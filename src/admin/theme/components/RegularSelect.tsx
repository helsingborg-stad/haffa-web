import { FormControl, InputLabel, Select, SelectProps } from '@mui/material'
import { nanoid } from 'nanoid'
import { PropsWithChildren } from 'react'

export const RegularSelect = (
    props: SelectProps<string> & PropsWithChildren
) => {
    const { children, label, id = nanoid() } = props
    return (
        <FormControl fullWidth>
            <InputLabel id={id}>{label}</InputLabel>
            <Select {...props} key={id} labelId={id} label={label}>
                {children}
            </Select>
        </FormControl>
    )
}
