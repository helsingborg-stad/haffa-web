import {
    Card,
    CardContent,
    FormControlLabel,
    FormGroup,
    Switch,
} from '@mui/material'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { Editorial } from 'editorials'
import { UserMappingConfiguration } from 'login-policies/types'
import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'

export const UserMappingConfigurationForm: FC<{
    userMappingConfiguration: UserMappingConfiguration
    onSave: (c: UserMappingConfiguration) => void
}> = ({ userMappingConfiguration, onSave }) => {
    const [enabled, setEnabled] = useState(
        userMappingConfiguration.allowGuestUsers
    )
    const { phrase } = useContext(PhraseContext)

    return (
        <Card>
            <CardContent>
                <Editorial phraseKey="PUBLIC_ACCESS_EDITORIAL">
                    {`
När publik åtkomst tillåts kan sajten användas i begränsad omfattning utan att inloggning krävs.
För att interagera med innehållet krävs alltid inloggning.

Notera att även om innehållet görs publikt så kommer sajtens innehåll troligtvis inte att hanteras och indexeras av sökmotorer.
                    `}
                </Editorial>
            </CardContent>
            <CardContent>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                            />
                        }
                        label={phrase(
                            'PUBLIC_ACCESS_ALLOW',
                            'Tillåt publik åtkomst'
                        )}
                    />
                </FormGroup>
                <AdminActionPanel
                    onSave={() => onSave({ allowGuestUsers: enabled })}
                />
            </CardContent>
        </Card>
    )
}
