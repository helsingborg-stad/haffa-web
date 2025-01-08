import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
    TextField,
} from '@mui/material'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { PhraseContext } from 'phrases'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { Func1 } from 'lib/types'
import { Advert, AdvertInput, AdvertLocation } from 'adverts'
import useAsync from 'hooks/use-async'
import { NotificationsContext } from 'notifications'
import { LocationContext } from 'locations'
import { AdvertFieldsContext } from 'advert-field-config'
import { AdvertFieldConfig, FieldName } from 'advert-field-config/types'
import { BulkActionDialogParams } from './types'
import { AdvertsTableContext } from '../AdvertsTable'

const PatchLocationDialogImpl: FC<
    BulkActionDialogParams & {
        title: string
        getValue: Func1<Advert, AdvertLocation>
        makePatch: Func1<AdvertLocation, Partial<AdvertInput>>
        locations: AdvertLocation[]
        fieldConfig: AdvertFieldConfig
        disabled?: boolean
    }
> = ({
    open,
    closeDialog,
    title,
    getValue,
    makePatch,
    locations,
    fieldConfig,
    disabled,
}) => {
    const { patchAdverts, selectionCommonValue } =
        useContext(AdvertsTableContext)
    const { phrase } = useContext(PhraseContext)
    const [value, setValue] = useState(
        selectionCommonValue(getValue, {
            name: '',
            adress: '',
            zipCode: '',
            city: '',
            country: '',
        })
    )

    const getLabel = useCallback(
        (name: FieldName) =>
            fieldConfig.find((f) => f.name === name)?.label || name,
        [fieldConfig]
    )
    const fields = useMemo<
        {
            label: string
            getValue: (location: AdvertLocation) => string
            makePatch: (input: string) => Partial<AdvertLocation>
        }[]
    >(
        () => [
            {
                label: getLabel('name'),
                getValue: ({ name }) => name,
                makePatch: (name) => ({ name }),
            },
            {
                label: getLabel('adress'),
                getValue: ({ adress }) => adress,
                makePatch: (adress) => ({ adress }),
            },
            {
                label: getLabel('zipCode'),
                getValue: ({ zipCode }) => zipCode,
                makePatch: (zipCode) => ({ zipCode }),
            },
            {
                label: getLabel('city'),
                getValue: ({ city }) => city,
                makePatch: (city) => ({ city }),
            },
        ],
        [getLabel]
    )

    return (
        <Dialog onClose={() => closeDialog()} open={open} fullWidth>
            <DialogTitle>{title}</DialogTitle>

            {value.conflict && (
                <DialogContent>
                    <Alert severity="warning">
                        {phrase(
                            'BULKACTION_WARNING_VALUE_CONFLICT',
                            'Markeringen innehåller olika värden'
                        )}
                    </Alert>
                </DialogContent>
            )}

            <DialogContent>
                <Stack direction="column" spacing={1} py={1}>
                    {locations.map(
                        ({ name, adress, zipCode, city, country }) => (
                            <FormControl fullWidth>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setValue({
                                            ...value,
                                            value: {
                                                name,
                                                adress,
                                                zipCode,
                                                city,
                                                country,
                                            },
                                        })
                                    }
                                >
                                    {[name, adress, zipCode, city]
                                        .filter((v) => v)
                                        .map((s) => (
                                            <>{s}&nbsp;</>
                                        ))}
                                </Button>
                            </FormControl>
                        )
                    )}
                    {fields.map(({ label, getValue, makePatch }) => (
                        <FormControl fullWidth>
                            <TextField
                                disabled={disabled}
                                type="text"
                                fullWidth
                                value={getValue(value.value)}
                                label={label}
                                placeholder={label}
                                onChange={(e) =>
                                    setValue({
                                        ...value,
                                        value: {
                                            ...value.value,
                                            ...makePatch(e.target.value),
                                        },
                                    })
                                }
                            />
                        </FormControl>
                    ))}
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

export const PatchLocationDialog: FC<
    BulkActionDialogParams & {
        title: string
        getValue: Func1<Advert, AdvertLocation>
        makePatch: Func1<AdvertLocation, Partial<AdvertInput>>
    }
> = (props) => {
    const { error } = useContext(NotificationsContext)
    const { phrase } = useContext(PhraseContext)
    const { getLocations } = useContext(LocationContext)
    const { getFieldConfig } = useContext(AdvertFieldsContext)
    const view = useAsync(() => Promise.all([getLocations(), getFieldConfig()]))

    return view({
        resolved: ([locations, fieldConfig]) => (
            <PatchLocationDialogImpl
                {...props}
                locations={locations}
                fieldConfig={fieldConfig}
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
            <PatchLocationDialogImpl
                {...props}
                locations={[]}
                fieldConfig={[]}
                disabled
            />
        ),
    })
}
