import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    useMediaQuery,
    Button,
    useTheme,
} from '@mui/material'
import { FC, useState } from 'react'
import { CategoriesFilter } from './CategoriesFilter'

export interface SelectedFilters {
    categories: string[]
}

export interface FilterDialogProps {
    open: boolean
    closeDialog: () => void
    filters: SelectedFilters
    onFiltersChanged: (filters: SelectedFilters) => void
}

export const FilterDialog: FC<FilterDialogProps> = ({
    open,
    closeDialog,
    filters,
    onFiltersChanged,
}) => {
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [categories, setCategories] = useState<string[]>(filters.categories)

    const onSave = () => {
        onFiltersChanged({ categories })
        closeDialog()
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={closeDialog}
            aria-labelledby="responsive-dialog-title"
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle id="responsive-dialog-title">
                Filtrera Annonser
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Kategorier</DialogContentText>
                <CategoriesFilter
                    selected={categories}
                    onCategoriesChanged={setCategories}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onSave} autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
