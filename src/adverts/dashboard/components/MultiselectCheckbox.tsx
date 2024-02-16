import { Checkbox } from '@mui/material'
import { FC } from 'react'

export const MultiselectCheckbox: FC<{
    selected: Set<string>
    viable: string[]
    onChange: (selected: Set<string>) => void
}> = ({ selected, viable, onChange }) => (
    <Checkbox
        checked={viable.every((v) => selected.has(v))}
        indeterminate={
            selected.size > 0 && viable.some((v) => !selected.has(v))
        }
        onChange={(e) =>
            e.target.checked
                ? onChange(new Set<string>(viable))
                : onChange(new Set<string>())
        }
    />
)
