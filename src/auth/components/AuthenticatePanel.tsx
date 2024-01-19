import { FC, Fragment, useContext, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { SystemSettingsContext } from 'system-settings'
import { SystemSettings } from 'system-settings/types'
import { AuthenticateForm } from './AuthenticateForm'

interface Provider {
    type: 'email' | 'phone'
    label: string
}
const makeProvider = (p: Provider): Provider => p

const ProvidersView: FC<{
    providers: Provider[]
    onAuthenticated: () => void
}> = ({ providers, onAuthenticated }) => {
    const [expanded, setExpanded] = useState<'email' | 'phone' | ''>(
        providers[0].type || ''
    )
    if (providers.length === 1) {
        return (
            <Fragment key="single">
                <AuthenticateForm
                    key="email"
                    onAuthenticated={onAuthenticated}
                    type="email"
                />
            </Fragment>
        )
    }
    return (
        <div key="multiple">
            {providers.map(({ type, label }) => (
                <Accordion
                    key={type}
                    expanded={expanded === type}
                    onChange={(_, isExpanded) =>
                        setExpanded(isExpanded ? type : '')
                    }
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {label}
                    </AccordionSummary>
                    <AccordionDetails>
                        {' '}
                        <AuthenticateForm
                            key={type}
                            onAuthenticated={onAuthenticated}
                            type={type}
                        />
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    )
}

export const AuthenticatePanel: FC<{ onAuthenticated: () => void }> = ({
    onAuthenticated,
}) => {
    const { getSystemSettings } = useContext(SystemSettingsContext)
    const view = useAsync(getSystemSettings)

    const getProviders = ({ allowPhoneUsers }: SystemSettings): Provider[] => [
        ...(allowPhoneUsers
            ? [
                  makeProvider({
                      type: 'phone',
                      label: 'Logga in med SMS',
                  }),
              ]
            : []),
        ...[
            makeProvider({
                type: 'email',
                label: 'Logga in med email',
            }),
        ],
    ]

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (options) => (
            <ProvidersView
                onAuthenticated={onAuthenticated}
                providers={getProviders(options)}
            />
        ),
    })
}
