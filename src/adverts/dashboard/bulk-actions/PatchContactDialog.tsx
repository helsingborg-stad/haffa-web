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
    Stack,
    TextField,
} from '@mui/material'
import { FC, useContext, useId, useMemo, useState } from 'react'
import { PhraseContext } from 'phrases'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { Func1 } from 'lib/types'
import { Advert, AdvertContact, AdvertInput } from 'adverts'
import useAsync from 'hooks/use-async'
import { TermsContext } from 'terms'
import { NotificationsContext } from 'notifications'
import { BulkActionDialogParams } from './types'
import { AdvertsTableContext } from '../AdvertsTable'

const PatchContactDialogImpl: FC<
    BulkActionDialogParams & {
        title: string
        getValue: Func1<Advert, AdvertContact>
        makePatch: Func1<AdvertContact, Partial<AdvertInput>>
        organizations: string[]
        disabled?: boolean
    }
> = ({
    open,
    closeDialog,
    title,
    getValue,
    makePatch,
    organizations,
    disabled,
}) => {
    const { patchAdverts, selectionCommonValue } =
        useContext(AdvertsTableContext)
    const { phrase } = useContext(PhraseContext)
    const [value, setValue] = useState(
        selectionCommonValue(getValue, {
            phone: '',
            email: '',
            organization: '',
        })
    )

    const organizationSelectId = useId()
    const organizationSelectLabelId = useId()

    const labels = useMemo(
        () => ({
            email: phrase('PROFILE_FIELD_EMAIL', 'Email'),
            phone: phrase('PROFILE_FIELD_PHONE', 'Telefon'),
            organization: phrase('PROFILE_FIELD_ORGANIZATION', 'Organization'),
        }),
        [phrase]
    )

    return (
        <Dialog onClose={() => closeDialog()} open={open} fullWidth>
            <DialogTitle>{title}</DialogTitle>
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
                <Stack direction="column" spacing={1}>
                    <FormControl fullWidth>
                        <TextField
                            disabled={disabled}
                            type="text"
                            fullWidth
                            value={value.value.email}
                            label={labels.email}
                            placeholder={labels.email}
                            onChange={(e) =>
                                setValue({
                                    ...value,
                                    value: {
                                        ...value.value,
                                        email: e.target.value,
                                    },
                                })
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            disabled={disabled}
                            type="text"
                            fullWidth
                            value={value.value.phone}
                            label={labels.phone}
                            placeholder={labels.phone}
                            onChange={(e) =>
                                setValue({
                                    ...value,
                                    value: {
                                        ...value.value,
                                        phone: e.target.value,
                                    },
                                })
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id={organizationSelectLabelId}>
                            {labels.organization}
                        </InputLabel>
                        <Select
                            disabled={disabled}
                            labelId={organizationSelectLabelId}
                            id={organizationSelectId}
                            value={value.value.organization}
                            label={labels.organization}
                            onChange={(e) =>
                                setValue({
                                    ...value,
                                    value: {
                                        ...value.value,
                                        organization: e.target.value,
                                    },
                                })
                            }
                        >
                            <MenuItem key="clear" value="">
                                <em>Inget val</em>
                            </MenuItem>
                            {organizations.map((o) => (
                                <MenuItem value={o}>{o}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => closeDialog()}
                    startIcon={<CancelIcon />}
                >
                    {phrase('BULKACTION_DIALOG_CANCEL', 'Ångra')}
                </Button>
                <Button
                    disabled={disabled}
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

export const PatchContactDialog: FC<
    BulkActionDialogParams & {
        title: string
        getValue: Func1<Advert, AdvertContact>
        makePatch: Func1<AdvertContact, Partial<AdvertInput>>
    }
> = (props) => {
    const { error } = useContext(NotificationsContext)
    const { phrase } = useContext(PhraseContext)
    const { getTerms } = useContext(TermsContext)
    const view = useAsync(getTerms)

    return view({
        resolved: (terms) => (
            <PatchContactDialogImpl
                {...props}
                organizations={terms.organization}
            />
        ),
        rejected: () => {
            error({
                message: phrase(
                    'ERROR_UNKNOWN',
                    'Något gick fel. Försök igen.'
                ),
            })
            return null
        },
        pending: () => (
            <PatchContactDialogImpl {...props} organizations={[]} disabled />
        ),
    })
}
