import { type AlertProps, Typography } from '@mui/material'
import { VariantRadioGroup } from '../components/VariantRadioGroup'
import { PreviewAlert } from '../preview/Alert'
import type { ThemeSectionProps } from './types'

const ALERT_PREVIEWS: AlertProps[] = [
    { severity: 'success' },
    { severity: 'info' },
    { severity: 'warning' },
    { severity: 'error' },
]

export const NoticesSection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography variant="h6" py={2}>
            Notiser
        </Typography>
        <VariantRadioGroup
            label="Typ (Delad)"
            value={model['component.alert.variant']}
            onChange={(value) =>
                patch({
                    'component.alert.variant': value as AlertProps['variant'],
                })
            }
        />
        {ALERT_PREVIEWS.map((props, key) => (
            <PreviewAlert
                key={key}
                {...props}
                variant={model['component.alert.variant']}
            />
        ))}
    </>
)
