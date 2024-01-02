import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
} from '@mui/material'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { TermsContext } from 'terms'

export interface TagsFilterProps {
    selected: string[]
    onTagsChanged: (newTags: string[]) => void
}

export const TagsFilter: FC<TagsFilterProps> = ({
    selected,
    onTagsChanged,
}) => {
    const { getTerms } = useContext(TermsContext)
    const termsInspect = useAsync(getTerms)

    const isChecked = (tag: string) =>
        selected.some((v) => tag.localeCompare(v) === 0)

    const onChange = (tag: string, checked: boolean) => {
        const newTags = checked
            ? [...selected, tag]
            : selected.filter((i) => tag.localeCompare(i) !== 0)
        onTagsChanged(newTags)
    }

    return termsInspect({
        pending: () => null,
        rejected: (e) => {
            console.error(e)
            return <Box>Hoppsan! Något gick fel</Box>
        },
        resolved: (terms) => (
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
        ),
    })
}
