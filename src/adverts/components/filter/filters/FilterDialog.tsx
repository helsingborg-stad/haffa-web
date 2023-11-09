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
import { AdvertFilterInput } from 'adverts'
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
