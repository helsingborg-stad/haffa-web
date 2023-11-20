import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    Button,
    useTheme,
    IconButton,
} from '@mui/material'
import { FC, useContext, useState } from 'react'
import { AdvertFilterInput } from 'adverts'
import { PhraseContext } from 'phrases'
import CloseIcon from '@mui/icons-material/Close'
import { CategoriesFilter } from './CategoriesFilter'

export interface SelectedFilters {
    categories: string[]
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

    const onSave = () => {
        setSearchParams({
            ...searchParams,
            fields: {
                ...searchParams.fields,
                category:
                    categories.length > 0 ? { in: categories } : undefined,
            },
        })
        onClose()
    }

    return (
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
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onSave} autoFocus>
                    {phrase('DIALOG_FILTER_SAVE', 'Spara')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setCategories([])}
                    autoFocus
                >
                    {phrase('DIALOG_FILTER_CLEAR', 'Rensa')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
