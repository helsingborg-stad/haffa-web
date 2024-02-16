import { Checkbox } from '@mui/material'
import { FC } from 'react'

export const SingleselectCheckbox: FC<{
    id: string
    selected: Set<string>
    onChange: (selected: Set<string>) => void
}> = ({ id, selected, onChange }) => (
    <Checkbox
        checked={selected.has(id)}
        onChange={(e) =>
            e.target.checked
                ? onChange(new Set<string>([id, ...selected]))
                : onChange(
                      new Set<string>([...selected].filter((v) => v !== id))
                  )
        }
    />
)
