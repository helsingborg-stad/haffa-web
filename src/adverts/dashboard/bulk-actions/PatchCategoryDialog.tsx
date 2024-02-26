import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material'
import { FC, useContext, useState } from 'react'
import { PhraseContext } from 'phrases'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { sortBy } from 'lib/sort-by'
import { AdvertsTableContext } from '../AdvertsTable'
import { BulkActionDialogParams } from './types'

export const PatchCategoryDialog: FC<BulkActionDialogParams> = ({
    open,
    closeDialog,
}) => {
    const {
        patchAdverts,
        selectionCommonValue,
        categoryTree: { allNodes, pathById },
    } = useContext(AdvertsTableContext)
    const { phrase } = useContext(PhraseContext)
    const [selected, setSelected] = useState(
        selectionCommonValue((a) => a.category, '')
    )

    return (
        <Dialog onClose={() => closeDialog()} open={open} fullWidth>
            <DialogTitle>
                {phrase('BULKADVERTACTION_EDIT_CATEGORIES', 'Sätt kategorier')}
            </DialogTitle>
            <DialogContent>
                {selected.conflict && (
                    <Alert severity="warning">
                        {phrase(
                            'BULKAKTION_WARNING_VALUE_CONFLICT',
                            'Markeringen innehåller olika värden'
                        )}
                    </Alert>
                )}
            </DialogContent>
            <DialogContent>
                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>
                        {phrase(
                            'BULKADVERTACTION_EDIT_CATEGORIES',
                            'Sätt kategorier'
                        )}
                    </InputLabel>
                    <Select
                        fullWidth
                        value={selected.value}
                        label="Kategori"
                        onChange={(e) =>
                            setSelected({ ...selected, value: e.target.value })
                        }
                    >
                        {[
                            { id: '', label: '(Ingen kategori)' },
                            ...allNodes
                                .map((c) => ({
                                    id: c.id,
                                    label: pathById(c.id)
                                        .map(({ label }) => label)
                                        .join(' - '),
                                }))
                                .sort(
                                    sortBy(({ label }) => label.toLowerCase())
                                ),
                        ].map(({ id, label }) => (
                            <MenuItem key={id} value={id}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => closeDialog()}
                    startIcon={<CancelIcon />}
                >
                    {phrase('BULKACTION_DIALOG_CANCEL', 'Ångra')}
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        closeDialog()
                        patchAdverts({ category: selected.value })
                    }}
                    startIcon={<SaveAltIcon />}
                >
                    {phrase('BULKACTION_DIALOG_SAVE', 'Utför')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
