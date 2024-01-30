import {
    Autocomplete,
    FormControlLabel,
    FormGroup,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { Advert, AdvertList, AdvertsContext } from 'adverts'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { PhraseContext } from 'phrases'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { SmsTemplate } from 'sms-templates'

interface UseDebounceState<T> {
    pending: boolean
    value: T
    enqueue: (key: any, next: () => Promise<T>) => void
}
const useDebounce = <T,>(
    initialKey: any,
    initial: T,
    initialFetch: () => Promise<T>
): UseDebounceState<T> => {
    interface State {
        key: any
        value: T
        current: Promise<any> | null
        next: (() => Promise<T>) | null
    }
    const [state, setState] = useState<State>({
        key: initialKey,
        value: initial,
        current: null,
        next: initialFetch,
    })

    useEffect(() => {
        const { current, next } = state
        if (current) {
            return
        }
        if (next) {
            setState({
                ...state,
                next: null,
                current: next().then((v) =>
                    setState({
                        ...state,
                        value: v,
                        current: null,
                    })
                ),
            })
        }
    })

    return {
        pending: state.current != null,
        value: state.value,
        enqueue: (key) => {
            if (key !== state.key) {
                // console.log({ key, s: state.key })
                console.log(key)
                setState({
                    ...state,
                    key,
                })
            }
            /* key !== state.key &&
                setState({
                    ...state,
                    key,
                    next,
                }) */
        },
    }
}

const SelectSampleAdvert: FC<{ onChange: (advert: Advert | null) => void }> = ({
    onChange,
}) => {
    const { listAdverts } = useContext(AdvertsContext)
    const { value: adverts, enqueue } = useDebounce<AdvertList | null>(
        null,
        null,
        () => listAdverts({ search: '' })
    )

    return (
        <Autocomplete
            options={adverts?.adverts || []}
            renderOption={(props, advert) => (
                <Typography key={advert.id} {...props}>
                    {advert.title}
                </Typography>
            )}
            onInputChange={(_, search) =>
                enqueue(search, () => listAdverts({ search }))
            }
            onChange={(_, value) => onChange(value)}
            getOptionLabel={(advert) => advert.title}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Sök annons"
                    InputProps={{
                        ...params.InputProps,
                        type: 'search',
                    }}
                />
            )}
        />
    )
}

export const EditSmsTemplatesForm: FC<{
    templates: SmsTemplate[]
    onUpdate: (templates: SmsTemplate[]) => void
}> = ({ templates, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const [memo, setMemo] = useState<SmsTemplate[]>(
        templates.map(({ templateId, template, enabled }) => ({
            templateId,
            template,
            enabled,
        }))
    )

    const [previewAdvert, setPreviewAdvert] = useState<Advert | null>(null)

    const updatePreviewAdvert = useCallback(
        (advert: Advert | null) => {
            setPreviewAdvert(advert)
        },
        [setPreviewAdvert]
    )
    const mutateTemplate = useCallback(
        (t: SmsTemplate, patch: Partial<SmsTemplate>) => {
            setMemo(
                memo.map((existing) =>
                    existing === t ? { ...existing, ...patch } : existing
                )
            )
        },
        [memo, setMemo]
    )

    const saveTemplates = useCallback(() => onUpdate(memo), [onUpdate, memo])
    /*
    useEffect(() => {
        if (previewAdvert) {
            preview.enqueue(
                [
                    previewAdvert.id,
                    ...memo.map(({ templateId }) => templateId),
                    ...memo.map(({ template }) => template),
                ].join('@'),
                () =>
                    previewSmsTemplates(memo, previewAdvert).then((p) =>
                        toMap(
                            p,
                            ({ templateId }) => templateId,
                            (t) => t
                        )
                    )
            )
        }
    })
*/
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '1%' }}>Id</TableCell>
                        <TableCell>
                            {phrase('SMS_TEMPLATE_FIELD_ENABLED', 'Aktiv')}
                        </TableCell>
                        <TableCell>
                            {phrase('SMS_TEMPLATE_FIELD_TEMPLATE', 'Mall')}
                        </TableCell>
                        <TableCell>
                            <SelectSampleAdvert
                                onChange={updatePreviewAdvert}
                            />
                            [{previewAdvert?.id}]
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>
                            <AdminActionPanel onSave={saveTemplates} />
                        </TableCell>
                    </TableRow>
                </TableFooter>
                <TableBody>
                    {memo.map((t) => (
                        <TableRow key={t.templateId}>
                            <TableCell>
                                <Typography style={{ whiteSpace: 'nowrap' }}>
                                    {t.templateId}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={t.enabled}
                                                onChange={(e) =>
                                                    mutateTemplate(t, {
                                                        enabled:
                                                            e.target.checked,
                                                    })
                                                }
                                            />
                                        }
                                        label={phrase(
                                            'SMS_TEMPLATE_FIELD_ENABLED',
                                            'Aktiv'
                                        )}
                                    />
                                </FormGroup>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label={phrase(
                                        'SMS_TEMPLATE_FIELD_TEMPLATE',
                                        'Mall'
                                    )}
                                    placeholder={phrase(
                                        'SMS_TEMPLATE_FIELD_TEMPLATE',
                                        'Mall'
                                    )}
                                    fullWidth
                                    multiline
                                    value={t.template}
                                    onChange={(e) =>
                                        mutateTemplate(t, {
                                            template: e.target.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
