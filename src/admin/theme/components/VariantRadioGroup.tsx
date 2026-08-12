import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material'
import { useId } from 'react'

const DEFAULT_VARIANTS: Array<[string, string]> = [
    ['outlined', 'Kontur'],
    ['filled', 'Fylld'],
    ['standard', 'Standard'],
]

export const VariantRadioGroup = ({
    label,
    value,
    options = DEFAULT_VARIANTS,
    onChange,
}: {
    label: string
    value?: string
    options?: Array<[string, string]>
    onChange: (value: string) => void
}) => {
    const id = useId()
    return (
        <FormControl>
            <FormLabel id={id}>{label}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={id}
                value={value}
                onChange={({ target: { value } }) => onChange(value)}
            >
                {options.map(([variant, variantLabel]) => (
                    <FormControlLabel
                        key={variant}
                        value={variant}
                        control={<Radio />}
                        label={variantLabel}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    )
}
