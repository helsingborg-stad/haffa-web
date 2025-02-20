import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    Button,
    useTheme,
    IconButton,
    Box,
    Stack,
} from '@mui/material'
import { FC, useContext, useState } from 'react'
import { AdvertFilterInput } from 'adverts'
import { PhraseContext } from 'phrases'
import CloseIcon from '@mui/icons-material/Close'
import { TermsContext } from 'terms'
import useAsync from 'hooks/use-async'
import { TagsContext } from 'tags'
import { AuthContext } from 'auth'
import { CategoriesFilter } from './CategoriesFilter'
import { StringArrayFilter } from './StringArrayFilter'
import { CategoriesFilter2 } from './experimental/CategoriesFilter2'

export interface SelectedFilters {
    categories: string[]
    tags: string[]
    size: string[]
}

export const FilterDialog: FC<{
    open: boolean
    onClose: () => void
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({ open, onClose, searchParams, setSearchParams }) => {
    const theme = useTheme()
    const { phrase } = useContext(PhraseContext)
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [categories, setCategories] = useState<string[]>(
        searchParams.fields?.category?.in ?? []
    )
    const [tags, setTags] = useState<string[]>(
        searchParams.fields?.tags?.in ?? []
    )
    const [sizes, setSizes] = useState<string[]>(
        searchParams.fields?.size?.in ?? []
    )

    const { roles } = useContext(AuthContext)
    const { getTerms } = useContext(TermsContext)
    const { getTagDescriptions } = useContext(TagsContext)

    const inspect = useAsync(async () => {
        const [terms, tagDescriptions] = await Promise.all([
            getTerms(),
            getTagDescriptions(),
        ])

        const canSeeAllTags = roles.canManageAllAdverts
        return {
            sizes: terms.sizes.map((size) => ({ label: size, value: size })),
            tags: tagDescriptions
                .filter(({ label }) => canSeeAllTags || label)
                .map(({ label, tag }) => ({ label: label || tag, value: tag })),
        }
    })

    const onSave = () => {
        setSearchParams({
            ...searchParams,
            fields: {
                ...searchParams.fields,
                tags: tags.length > 0 ? { in: tags } : undefined,
                category:
                    categories.length > 0 ? { in: categories } : undefined,
                size: sizes.length > 0 ? { in: sizes } : undefined,
            },
        })
        onClose()
    }

    return inspect({
        pending: () => null,
        rejected: (e) => {
            console.error(e)
            return <Box>Hoppsan! Något gick fel</Box>
        },
        resolved: (model) => (
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => onClose()}
                aria-labelledby="responsive-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="responsive-dialog-title">
                    {phrase('DIALOG_FILTER_TITLE', 'Filter')}
                </DialogTitle>
                <IconButton
                    aria-label="Stäng"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Stack direction="column" spacing={1}>
                        {model.sizes.length > 0 && (
                            <StringArrayFilter
                                label={phrase('TERMS_FIELD_SIZES', 'Storlekar')}
                                values={model.sizes}
                                selected={sizes}
                                onChange={setSizes}
                            />
                        )}
                        <CategoriesFilter2
                            selected={categories}
                            onCategoriesChanged={setCategories}
                        />
                        {
                            // disable previous version of category filter
                            false && (
                                <CategoriesFilter
                                    selected={categories}
                                    onCategoriesChanged={setCategories}
                                />
                            )
                        }
                        {model.tags.length > 0 && (
                            <StringArrayFilter
                                label={phrase('TERMS_FIELD_TAGS', 'Taggar')}
                                values={model.tags}
                                selected={tags}
                                onChange={setTags}
                            />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={onSave} autoFocus>
                        {phrase('DIALOG_FILTER_SAVE', 'Spara')}
                    </Button>
                    <Button
                        variant="outlined"
                        autoFocus
                        onClick={() => {
                            setCategories([])
                            setTags([])
                            setSizes([])
                        }}
                    >
                        {phrase('DIALOG_FILTER_CLEAR', 'Rensa')}
                    </Button>
                </DialogActions>
            </Dialog>
        ),
    })
}
