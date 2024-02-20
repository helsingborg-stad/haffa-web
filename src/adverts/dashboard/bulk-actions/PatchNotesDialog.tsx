import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'
import { FC, useContext, useState } from 'react'
import { PhraseContext } from 'phrases'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { AdvertsTableContext } from '../AdvertsTable'
import { BulkActionDialogParams } from './types'

export const PatchNotesDialog: FC<BulkActionDialogParams> = ({
    open,
    closeDialog,
}) => {
    const { patchAdverts, selectionCommonValue } =
        useContext(AdvertsTableContext)
    const { phrase } = useContext(PhraseContext)
    const [value, setValue] = useState(selectionCommonValue((a) => a.notes, ''))

    return (
        <Dialog onClose={() => closeDialog()} open={open} fullWidth>
            <DialogTitle>
                {phrase('BULKACTION_EDIT_NOTES', 'Sätt notiser')}
            </DialogTitle>
            <DialogContent>
                <TextField
                    multiline
                    fullWidth
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
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
                        patchAdverts({ notes: value })
                    }}
                    startIcon={<SaveAltIcon />}
                >
                    {phrase('BULKACTION_DIALOG_SAVE', 'Utför')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
