import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
} from '@mui/material'
import { FC } from 'react'
import { Terms } from 'terms/types'

export interface SizeFilterProps {
    selected: string[]
    onSizeChanged: (newSizes: string[]) => void
    terms: Terms
}

export const SizeFilter: FC<SizeFilterProps> = ({
    selected,
    onSizeChanged,
    terms,
}) => {
    const isChecked = (size: string) =>
        selected.some((v) => size.localeCompare(v) === 0)

    const onChange = (size: string, checked: boolean) => {
        const newSize = checked
            ? [...selected, size]
            : selected.filter((i) => size.localeCompare(i) !== 0)
        onSizeChanged(newSize)
    }

    return (
        <>
            <Typography variant="subtitle1">Storlek</Typography>
            <FormGroup sx={{ pl: 2 }}>
                {terms.sizes.map((t, key) => (
                    <FormControlLabel
                        label={t}
                        key={key}
                        control={
                            <Checkbox
                                checked={isChecked(t)}
                                onChange={({ target: { checked } }) =>
                                    onChange(t, checked)
                                }
                            />
                        }
                    />
                ))}
            </FormGroup>
        </>
    )
}
