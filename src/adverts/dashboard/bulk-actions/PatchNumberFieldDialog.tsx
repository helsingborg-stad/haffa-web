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
    type TextFieldProps,
} from '@mui/material'
import type { Advert, AdvertInput } from 'adverts'
import type { Func1 } from 'lib/types'
import { PhraseContext } from 'phrases'
import { type FC, useContext, useState } from 'react'
import { AdvertsTableContext } from '../AdvertsTable'
import type { BulkActionDialogParams } from './types'

export const PatchNumberFieldDialog: FC<
    BulkActionDialogParams & {
        label: string
        getValue: Func1<Advert, number>
        makePatch: Func1<number, Partial<AdvertInput>>
        slotProps?: TextFieldProps['slotProps']
    }
> = ({ open, closeDialog, label, getValue, makePatch, slotProps }) => {
    const { patchAdverts, selectionCommonValue } =
        useContext(AdvertsTableContext)
    const { phrase } = useContext(PhraseContext)
    const [value, setValue] = useState(selectionCommonValue(getValue, 0))

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
                    slotProps={{
                        ...slotProps,
                        htmlInput: {
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            ...slotProps?.htmlInput,
                        },
                    }}
                    value={value.value}
                    onChange={(e) =>
                        setValue({
                            ...value,
                            value: parseInt(e.target.value, 10) || 0,
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
