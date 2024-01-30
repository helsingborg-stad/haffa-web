import {
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
    debounce,
} from '@mui/material'
import { Advert } from 'adverts'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { toMap } from 'lib/to-map'
import { PhraseContext } from 'phrases'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { SmsTemplate, SmsTemplateContext } from 'sms-templates'
import { SmsTemplatePreview } from 'sms-templates/types'
import { SelectSampleAdvert } from './SelectSampleAdvert'

export const EditSmsTemplatesForm: FC<{
    templates: SmsTemplate[]
    onUpdate: (templates: SmsTemplate[]) => void
}> = ({ templates, onUpdate }) => {
    const { previewSmsTemplates } = useContext(SmsTemplateContext)
    const { phrase } = useContext(PhraseContext)
    const [memo, setMemo] = useState<SmsTemplate[]>(
        templates.map(({ templateId, template, enabled }) => ({
            templateId,
            template,
            enabled,
        }))
    )

    const [preview, setPreview] = useState<Record<string, SmsTemplatePreview>>(
        {}
    )
    const fetchPreview = useMemo(
        () =>
            debounce(
                (templates: SmsTemplate[], advert: Advert | null) =>
                    advert &&
                    previewSmsTemplates(templates, { advert }).then(
                        (previews) =>
                            setPreview(
                                toMap(
                                    previews,
                                    ({ templateId }) => templateId,
                                    (t) => t
                                )
                            )
                    ),
                300
            ),
        [previewSmsTemplates, setPreview]
    )

    const [previewAdvert, setPreviewAdvert] = useState<Advert | null>(null)

    const updatePreviewAdvert = useCallback(
        (advert: Advert | null) => {
            setPreviewAdvert(advert)
            fetchPreview(memo, advert)
        },
        [setPreviewAdvert, fetchPreview]
    )
    const mutateTemplate = useCallback(
        (t: SmsTemplate, patch: Partial<SmsTemplate>) => {
            const newMemo = memo.map((existing) =>
                existing === t ? { ...existing, ...patch } : existing
            )
            setMemo(newMemo)
            fetchPreview(newMemo, previewAdvert)
        },
        [memo, setMemo, fetchPreview]
    )

    const saveTemplates = useCallback(() => onUpdate(memo), [onUpdate, memo])
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
                                label={phrase(
                                    'SMS_TEMPLATE_PREVIEW_WITH_ADVERT',
                                    'Förhandsgranska med annons'
                                )}
                            />
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

                            <TableCell>
                                {preview[t.templateId]?.preview}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
