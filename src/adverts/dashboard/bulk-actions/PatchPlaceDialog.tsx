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
import { AdvertsTableContext } from '../AdvertsTable'
import { BulkActionDialogParams } from './types'

export const PatchPlaceDialog: FC<BulkActionDialogParams> = ({
    open,
    closeDialog,
}) => {
    const { patchAdverts, selectionCommonValue, terms } =
        useContext(AdvertsTableContext)
    const { phrase } = useContext(PhraseContext)
    const [selected, setSelected] = useState(
        selectionCommonValue((a) => a.place, '')
    )

    return (
        <Dialog onClose={() => closeDialog()} open={open} fullWidth>
            <DialogTitle>
                {phrase('BULKADVERTACTION_CHANGE_PLACE', 'Ändra plats')}
            </DialogTitle>
            <DialogContent>
                {selected.conflict && (
                    <Alert severity="warning">
                        {phrase(
                            'BULKACTION_WARNING_VALUE_CONFLICT',
                            'Markeringen innehåller olika värden'
                        )}
                    </Alert>
                )}
            </DialogContent>
            <DialogContent>
                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>
                        {phrase('BULKADVERTACTION_CHANGE_PLACE', 'Ändra plats')}
                    </InputLabel>
                    <Select
                        fullWidth
                        value={selected.value}
                        label="Kategori"
                        onChange={(e) =>
                            setSelected({ ...selected, value: e.target.value })
                        }
                    >
                        {terms.places.map((p) => (
                            <MenuItem key={p} value={p}>
                                {p}
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
                        patchAdverts({ place: selected.value })
                    }}
                    startIcon={<SaveAltIcon />}
                >
                    {phrase('BULKACTION_DIALOG_SAVE', 'Utför')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
