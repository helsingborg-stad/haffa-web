import { Autocomplete, SxProps, TextField } from '@mui/material'
import { PhraseContext } from 'phrases'
import { useContext } from 'react'

export const TagEditor = (props: {
    sx?: SxProps
    tags: string[]
    options: string[]
    onUpdateTags: (tags: string[]) => void
}) => {
    const { tags, onUpdateTags, options, sx } = props

    const { phrase } = useContext(PhraseContext)

    return (
        <Autocomplete
            sx={sx}
            multiple
            id="tags"
            value={tags}
            options={options}
            noOptionsText={phrase(
                'ADVERT_FIELD_TAGS_NOOPTIONS',
                'Inga fler val'
            )}
            onChange={(_, values) => {
                onUpdateTags(values)
            }}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={phrase(
                        'ADVERT_FIELD_TAGS_LABEL',
                        'Tagga din annons för att göra det lättare att hitta den'
                    )}
                    placeholder={phrase(
                        'ADVERT_FIELD_TAGS_PLACEHOLDER',
                        'Klicka för att lägga till'
                    )}
                />
            )}
        />
    )
}
