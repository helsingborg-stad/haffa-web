import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { FC, useContext, useState } from 'react'
import { Editorial } from 'editorials'
import SaveIcon from '@mui/icons-material/Save'
import { PhraseContext } from 'phrases'
import { getOption } from 'options'
import { AnalyticsOptions } from 'analytics/types'
import type { Option } from '../../options/types'

export const EditAnalyticsForm: FC<{
    options: Option<AnalyticsOptions>[]
    onUpdate: (options: Option<AnalyticsOptions>[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const [provider, setProvider] = useState(
        getOption('provider', options) ?? 'none'
    )
    const [config, setConfig] = useState(getOption('config', options) ?? '')

    return (
        <Card>
            <Editorial>
                {phrase('ANALYTICS_EDITORIAL', 'Definitioner för web-analys')}
            </Editorial>
            <CardContent>
                <FormControl fullWidth>
                    <FormLabel id="analytics-provider-label">
                        {phrase('ANALYTICS_PROVIDER_LABEL', 'Leverantör')}
                    </FormLabel>
                    <Select
                        labelId="analytics-provider-label"
                        value={provider}
                        onChange={(event) => {
                            setProvider(event?.target.value)
                        }}
                    >
                        <MenuItem value="none">
                            {phrase('ANALYTICS_PROVIDER_MENU_NONE', 'Ej aktiv')}
                        </MenuItem>
                        <MenuItem value="matomo">
                            {phrase('ANALYTICS_PROVIDER_MENU_MATOMO', 'Matomo')}
                        </MenuItem>
                        <MenuItem value="google">
                            {phrase('ANALYTICS_PROVIDER_MENU_GOOGLE', 'Google')}
                        </MenuItem>
                    </Select>
                    <FormLabel
                        id="analytics-config-label"
                        sx={{ paddingTop: 3 }}
                    >
                        {phrase('ANALYTICS_CONFIG_LABEL', 'Konfiguration')}
                    </FormLabel>
                    <TextField
                        fullWidth
                        value={config}
                        disabled={provider === 'none'}
                        onChange={(event) => {
                            setConfig(event?.target.value)
                        }}
                    />
                </FormControl>
            </CardContent>
            <CardActions>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() =>
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
                >
                    {phrase('ANALYTICS_SAVE', 'Spara')}
                </Button>
            </CardActions>
        </Card>
    )
}
