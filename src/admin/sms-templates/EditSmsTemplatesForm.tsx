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
} from '@mui/material'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { PhraseContext } from 'phrases'
import { FC, useCallback, useContext, useState } from 'react'
import { SmsTemplate } from 'sms-templates'

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
    const mutateTemplate = useCallback(
        (t: SmsTemplate, patch: Partial<SmsTemplate>) =>
            setMemo(
                memo.map((existing) =>
                    existing === t ? { ...existing, ...patch } : existing
                )
            ),
        [memo, setMemo]
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
                        <TableRow>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
