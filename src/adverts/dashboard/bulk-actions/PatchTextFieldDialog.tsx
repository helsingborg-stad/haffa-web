import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'
import type { Advert, AdvertInput } from 'adverts'
import type { Func1 } from 'lib/types'
import { PhraseContext } from 'phrases'
import { type FC, useContext, useState } from 'react'
import { AdvertsTableContext } from '../AdvertsTable'
import type { BulkActionDialogParams } from './types'

export const PatchTextFieldDialog: FC<
    BulkActionDialogParams & {
        label: string
        getValue: Func1<Advert, string>
        makePatch: Func1<string, Partial<AdvertInput>>
        multiline?: boolean
        rows?: number
    }
> = ({ open, closeDialog, label, getValue, makePatch, multiline, rows }) => {
    const { patchAdverts, selectionCommonValue } =
        useContext(AdvertsTableContext)
    const { phrase } = useContext(PhraseContext)
    const [value, setValue] = useState(selectionCommonValue(getValue, ''))

    return (
        <Dialog onClose={() => closeDialog()} open={open} fullWidth>
            <DialogTitle>{label}</DialogTitle>
            <DialogContent>
                {value.conflict && (
                    <Alert severity="warning">
                        {phrase(
                            'BULKACTION_WARNING_VALUE_CONFLICT',
                            'Markeringen innehåller olika värden'
                        )}
                    </Alert>
                )}
            </DialogContent>
            <DialogContent>
                <TextField
                    type="text"
                    fullWidth
                    multiline={multiline}
                    rows={rows}
                    value={value.value}
                    onChange={(e) =>
                        setValue({
                            ...value,
                            value: e.target.value,
                        })
                    }
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
                        patchAdverts(makePatch(value.value))
                    }}
                    startIcon={<SaveAltIcon />}
                >
                    {phrase('BULKACTION_DIALOG_SAVE', 'Utför')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
