import { Card, CardContent, MenuItem, TextField } from '@mui/material'
import { FC, useState } from 'react'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { isValidUrl } from 'lib/string-utils'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { getOption } from 'options/mappers'
import type { AnalyticsOptionKeys, Option } from '../../options/types'

export const EditAnalyticsForm: FC<{
    options: Option<AnalyticsOptionKeys>[]
    onUpdate: (
        options: Option<AnalyticsOptionKeys>[]
    ) => Promise<Option<AnalyticsOptionKeys>[]>
}> = ({ options, onUpdate }) => {
    const [provider, setProvider] = useState(
        getOption('provider', options) ?? 'none'
    )
    const [config, setConfig] = useState(getOption('config', options) ?? '')

    const isValidForm = () =>
        (provider !== 'none' && isValidUrl(config)) ||
        (provider === 'none' && config === '')

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_ANALYTICS_HEADLINE"
                body="ADMIN_ANALYTICS_BODY"
            />
            <AdminActionPanel
                disabled={!isValidForm()}
                onSave={() =>
                    onUpdate([
                        {
                            key: 'config',
                            value: config,
                        },
                        {
                            key: 'provider',
                            value: provider,
                        },
                    ])
                }
                onRestore={() => {
                    setProvider('none')
                    setConfig('')
                }}
            />
            <Card>
                <CardContent>
                    <TextField
                        select
                        fullWidth
                        sx={{ mt: 2 }}
                        value={provider}
                        label="Leverantör"
                        onChange={({ target: { value } }) => {
                            setProvider(value)
                            if (value === 'none') {
                                setConfig('')
                            }
                        }}
                    >
                        <MenuItem value="none">Inaktiv</MenuItem>
                        <MenuItem value="matomo">Matomo</MenuItem>
                        <MenuItem value="google">Google</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        sx={{ my: 2 }}
                        label="Webbaddress till behållaren"
                        value={config}
                        error={!isValidForm()}
                        required={provider !== 'none'}
                        disabled={provider === 'none'}
                        onChange={({ target: { value } }) => setConfig(value)}
                    />
                </CardContent>
            </Card>
        </>
    )
}
