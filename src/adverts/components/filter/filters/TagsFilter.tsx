import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
} from '@mui/material'
import { FC } from 'react'
import { Terms } from 'terms/types'

export interface TagsFilterProps {
    selected: string[]
    onTagsChanged: (newTags: string[]) => void
    terms: Terms
}

export const TagsFilter: FC<TagsFilterProps> = ({
    selected,
    onTagsChanged,
    terms,
}) => {
    const isChecked = (tag: string) =>
        selected.some((v) => tag.localeCompare(v) === 0)

    const onChange = (tag: string, checked: boolean) => {
        const newTags = checked
            ? [...selected, tag]
            : selected.filter((i) => tag.localeCompare(i) !== 0)
        onTagsChanged(newTags)
    }

    return (
        <>
            <Typography variant="subtitle1">Taggar</Typography>
            <FormGroup sx={{ pl: 2 }}>
                {terms.tags.map((t, key) => (
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
