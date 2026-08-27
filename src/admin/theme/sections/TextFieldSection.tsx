import { type TextFieldProps, Typography } from '@mui/material'
import { VariantRadioGroup } from '../components/VariantRadioGroup'
import { PreviewTextField } from '../preview/TextField'
import type { ThemeSectionProps } from './types'

const TEXTFIELD_PREVIEWS: TextFieldProps[] = [
    { color: 'primary' },
    { color: 'secondary' },
    { disabled: true },
    { error: true },
]

export const TextFieldSection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Textfält
        </Typography>
        <VariantRadioGroup
            label="Typ (Delad)"
            value={model['component.textfield.variant']}
            onChange={(value) =>
                patch({
                    'component.textfield.variant':
                        value as TextFieldProps['variant'],
                })
            }
        />
        {TEXTFIELD_PREVIEWS.map((props, key) => (
            <PreviewTextField
                key={key}
                {...props}
                helperText="En hjälptext"
                variant={model['component.textfield.variant']}
            />
        ))}
    </>
)
