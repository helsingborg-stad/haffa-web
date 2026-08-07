import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Stack, type StackProps } from '@mui/material'
import { useFormControls } from 'hooks/use-form-controls'
import { PhraseContext } from 'phrases/PhraseContext'
import type { ProfileInput } from 'profile/types'
import { type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import type { Terms } from 'terms/types'

const Row: FC<PropsWithChildren & StackProps> = (props) => (
    <Stack direction="row" spacing={2} sx={{ pt: 2 }} {...props}>
        {props.children}
    </Stack>
)
const Cell: FC<PropsWithChildren & { sx?: object }> = (props) => (
    <Box sx={{ flexGrow: 1, ...(props.sx || {}) }}>
        {props.children}
    </Box>
)

export const ProfileForm: FC<{
    profile: ProfileInput
    terms: Terms
    disabled: boolean
    onSave: (profile: ProfileInput) => void
}> = ({ profile, terms, onSave, disabled }) => {
    const {
        model,
        simplifiedFactory: { textField, select },
    } = useFormControls<ProfileInput>(profile)
    const { phrase, PROFILE_SAVE: SAVE_PROFILE } = useContext(PhraseContext)

    const layout = useMemo(
        () => [
            [
                () =>
                    textField('name', phrase('PROFILE_FIELD_NAME', 'Namn'), {
                        disabled,
                        fullWidth: true,
                    }),
            ],
            [
                () =>
                    textField(
                        'phone',
                        phrase('PROFILE_FIELD_PHONE', 'Telefon'),
                        {
                            disabled,
                            fullWidth: true,
                        }
                    ),
            ],
            [
                () =>
                    textField(
                        'adress',
                        phrase('PROFILE_FIELD_ADRESS', 'Adress'),
                        {
                            disabled,
                            fullWidth: true,
                        }
                    ),
            ],
            [
                () =>
                    textField(
                        'zipCode',
                        phrase('PROFILE_FIELD_ZIPCODE', 'Postnummer'),
                        {
                            disabled,
                            fullWidth: true,
                        }
                    ),
            ],
            [
                () =>
                    textField('city', phrase('PROFILE_FIELD_CITY', 'Stad'), {
                        disabled,
                        fullWidth: true,
                    }),
            ],
            [
                () =>
                    textField(
                        'country',
                        phrase('PROFILE_FIELD_COUNTRY', 'Land'),
                        {
                            disabled: false,
                            fullWidth: true,
                        }
                    ),
            ],
            [
                () =>
                    select(
                        'organization',
                        phrase('PROFILE_FIELD_ORGANIZATION', 'Organization'),
                        terms.organization.map((o) => ({ label: o, value: o })),
                        {
                            disabled: false,
                            fullWidth: true,
                        }
                    ),
            ],
        ],
        [textField, phrase, terms.organization.map, select, disabled]
    )
    return (
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault()
                onSave(model)
                return false
            }}
        >
            {layout.map((row, rowIndex) => (
                <Row key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <Cell key={cellIndex}>{cell()}</Cell>
                    ))}
                </Row>
            ))}
            <Row sx={{ justifyContent: 'flex-end' }}>
                <Cell>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={disabled}
                    >
                        {SAVE_PROFILE}
                    </Button>
                </Cell>
            </Row>
        </Box>
    )
}
