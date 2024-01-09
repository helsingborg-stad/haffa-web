import { FormGroup, MenuItem, Select, Typography } from '@mui/material'
import { FC } from 'react'
import { Terms } from 'terms/types'

export interface SizeFilterProps {
    selected: string
    onSizeChanged: (newSize: string) => void
    terms: Terms
}

export const SizeFilter: FC<SizeFilterProps> = ({
    selected,
    onSizeChanged,
    terms,
}) => (
    <>
        <Typography variant="subtitle1">Storlek</Typography>
        <FormGroup sx={{ pl: 2 }}>
            <Select
                value={selected}
                onChange={({ target: { value } }) => onSizeChanged(value)}
            >
                {terms.sizes.map((size, i) => (
                    <MenuItem key={i} value={size}>
                        {size}
                    </MenuItem>
                ))}
            </Select>
        </FormGroup>
    </>
)
