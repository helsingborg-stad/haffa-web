import { FC, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AuthenticateForm } from './AuthenticateForm'

export const AuthenticatePanel: FC<{ onAuthenticated: () => void }> = ({
    onAuthenticated,
}) => {
    const [expanded, setExpanded] = useState<'' | 'email' | 'phone'>('email')
    return (
        <div>
            <Accordion
                expanded={expanded === 'email'}
                onChange={(_, isExpanded) =>
                    setExpanded(isExpanded ? 'email' : '')
                }
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Logga in med email
                </AccordionSummary>
                <AccordionDetails>
                    {' '}
                    <AuthenticateForm
                        key="email"
                        onAuthenticated={onAuthenticated}
                        type="email"
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === 'phone'}
                onChange={(_, isExpanded) =>
                    setExpanded(isExpanded ? 'phone' : '')
                }
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Logga in med SMS
                </AccordionSummary>
                <AccordionDetails>
                    {' '}
                    <AuthenticateForm
                        key="sms"
                        onAuthenticated={onAuthenticated}
                        type="phone"
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
