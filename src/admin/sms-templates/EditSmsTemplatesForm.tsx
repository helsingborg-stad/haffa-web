import {
    Card,
    CardContent,
    CardHeader,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
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
        <Stack spacing={2}>
            <AdminActionPanel onSave={saveTemplates} />
            {memo.map((t) => (
                <Card>
                    <CardHeader title={t.templateId} />
                    <CardContent>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={t.enabled}
                                        onChange={(e) =>
                                            mutateTemplate(t, {
                                                enabled: e.target.checked,
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
                    </CardContent>
                    <CardContent>
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
                                mutateTemplate(t, { template: e.target.value })
                            }
                        />
                    </CardContent>
                </Card>
            ))}
            <AdminActionPanel onSave={saveTemplates} />
        </Stack>
    )
}
