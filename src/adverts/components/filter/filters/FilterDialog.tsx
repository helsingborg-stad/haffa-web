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
} from '@mui/material'
import { FC, useContext, useState } from 'react'
import { AdvertFilterInput } from 'adverts'
import { PhraseContext } from 'phrases'
import CloseIcon from '@mui/icons-material/Close'
import { TermsContext } from 'terms'
import useAsync from 'hooks/use-async'
import { CategoriesFilter } from './CategoriesFilter'
import { TagsFilter } from './TagsFilter'
import { SizeFilter } from './SizeFilter'

export interface SelectedFilters {
    categories: string[]
    tags: string[]
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
    const [size, setSize] = useState<string>(
        searchParams.fields?.size?.eq ?? ''
    )

    const { getTerms } = useContext(TermsContext)
    const termsInspect = useAsync(getTerms)

    const onSave = () => {
        setSearchParams({
            ...searchParams,
            fields: {
                ...searchParams.fields,
                tags: tags.length > 0 ? { in: tags } : undefined,
                category:
                    categories.length > 0 ? { in: categories } : undefined,
                size: size.length > 0 ? { in: [size] } : undefined,
            },
        })
        onClose()
    }

    return termsInspect({
        pending: () => null,
        rejected: (e) => {
            console.error(e)
            return <Box>Hoppsan! Något gick fel</Box>
        },
        resolved: (terms) => (
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
                    <CategoriesFilter
                        selected={categories}
                        onCategoriesChanged={setCategories}
                    />
                    {terms.tags.length > 0 && (
                        <TagsFilter
                            terms={terms}
                            selected={tags}
                            onTagsChanged={setTags}
                        />
                    )}
                    {terms.sizes.length > 0 && (
                        <SizeFilter
                            terms={terms}
                            selected={size}
                            onSizeChanged={setSize}
                        />
                    )}
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
                            setSize('')
                        }}
                    >
                        {phrase('DIALOG_FILTER_CLEAR', 'Rensa')}
                    </Button>
                </DialogActions>
            </Dialog>
        ),
    })
}
