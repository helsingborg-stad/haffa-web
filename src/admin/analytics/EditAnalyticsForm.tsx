import {
    Card,
    CardContent,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material'
import { FC, useState } from 'react'
import { getOption } from 'options'
import { AnalyticsOptions } from 'analytics/types'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { isValidUrl } from 'lib/string-utils'
import type { Option } from '../../options/types'

export const EditAnalyticsForm: FC<{
    options: Option<AnalyticsOptions>[]
    onUpdate: (
        options: Option<AnalyticsOptions>[]
    ) => Promise<Option<AnalyticsOptions>[]>
}> = ({ options, onUpdate }) => {
    const [provider, setProvider] = useState(
        getOption('provider', options) ?? 'none'
    )
    const [config, setConfig] = useState(getOption('config', options) ?? '')

    const isValidForm = () =>
        (provider !== 'none' && isValidUrl(config)) ||
        (provider === 'none' && config === '')

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Inställningar för webbanalys
                </Typography>
                <Typography paragraph>
                    Om du vill följa upp besökarstatistik för Haffa och har en
                    behållare i en tagghanterare så kan du aktivera den här.
                </Typography>

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
            />
        </Card>
    )
}
