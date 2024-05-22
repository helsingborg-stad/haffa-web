import { FC, useCallback, useContext, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material'
import { Markdown } from 'components/Markdown'
import { AuthContext } from '../AuthContext'
import { PhraseContext } from '../../phrases/PhraseContext'
import { Phrase } from '../../phrases/Phrase'
import { delay } from '../../lib/delay'

const MIN_WAIT_FOR_LOGIN_MS = 1000

export const AuthenticateForm: FC<{
    type: 'email' | 'phone'
    onAuthenticated: () => void
}> = ({ type, onAuthenticated }) => {
    const { setAuthentication, authProvider } = useContext(AuthContext)
    const { phrase, ERROR_UNKNOWN, ERROR_UNAUTHORIZED } =
        useContext(PhraseContext)
    const [identity, setIdentity] = useState('')
    const [pincode, setPincode] = useState('')
    const [state, setState] = useState<{
        loading: boolean
        step: number
        termsAccepted: boolean
        errorMessage?: string
    }>({
        loading: false,
        step: 0,
        termsAccepted: false,
    })

    const { step, loading, errorMessage, termsAccepted } = state

    const config =
        type === 'email'
            ? {
                  labels: {
                      identify: phrase(
                          'AUTH_LABEL_ENTER_EMAIL',
                          'Ange din email'
                      ),
                      send: phrase(
                          'AUTH_LABEL_SEND_EMAIL',
                          'Skicka mig ett email med engångskod'
                      ),
                      sending: phrase(
                          'AUTH_LABEL_SENDING_EMAIL',
                          'Vi skickar ett mail till dig med en engångskod'
                      ),
                      checkInbox: phrase(
                          'AUTH_LABEL_READ_YOUR_EMAIL',
                          'Läs mailet från Haffa i din din inkorg'
                      ),
                      enterPincode: phrase(
                          'AUTH_LABEL_ENTER_PINCODE',
                          'Ange engångskoden från mailet'
                      ),
                  },
                  input: {
                      type: 'email',
                      autoComplete: 'email',
                      label: phrase('AUTH_LABEL_EMAIL', 'Email'),
                      placeholder: 'jag-själv@min-organisation.se',
                  },
              }
            : {
                  labels: {
                      identify: phrase(
                          'AUTH_LABEL_ENTER_PHONE',
                          'Ange ditt telefonnummer'
                      ),
                      send: phrase(
                          'AUTH_LABEL_SEND_SMS',
                          'Skicka mig ett SMS med engångskod'
                      ),
                      sending: phrase(
                          'AUTH_LABEL_SENDING_SMS',
                          'Vi skickar ett SMS till dig med en engångskod'
                      ),
                      checkInbox: phrase(
                          'AUTH_LABEL_READ_YOUR_SMS',
                          'Kolla SMSet från Haffa'
                      ),
                      enterPincode: phrase(
                          'AUTH_LABEL_ENTER_SMS_PINCODE',
                          'Ange engångskoden från SMSet'
                      ),
                  },
                  input: {
                      type: 'tel',
                      autoComplete: 'tel',
                      label: phrase('AUTH_LABEL_PHONE', 'Telefonnummer'),
                      placeholder: '0721234567',
                  },
              }

    const gotEmail = useCallback(async () => {
        setState({
            ...state,
            loading: true,
            errorMessage: '',
        })
        try {
            setState({
                ...state,
                step: 1,
            })
            const [status] = await Promise.all([
                authProvider.requestPincode(identity),
                delay(MIN_WAIT_FOR_LOGIN_MS),
            ])
            if (status === 'accepted') {
                setState({
                    ...state,
                    step: 3,
                    loading: false,
                    errorMessage: '',
                })
            } else {
                setState({
                    ...state,
                    loading: false,
                    errorMessage: ERROR_UNAUTHORIZED,
                })
            }
        } catch (error) {
            setState({
                ...state,
                loading: false,
                errorMessage: ERROR_UNKNOWN,
            })
        }
    }, [authProvider, state, identity])
    const gotPincode = useCallback(async () => {
        setState({
            ...state,
            loading: true,
            errorMessage: '',
        })
        try {
            const authentication = await authProvider.authenticate(
                identity,
                pincode
            )
            if (authentication && authentication.token) {
                setAuthentication(authentication)
                onAuthenticated()
            } else {
                setState({
                    ...state,
                    loading: false,
                    errorMessage: phrase(
                        'AUTH_LOGIN_FAILED',
                        'Vi kunde inte logga in dig. Försök igen.'
                    ),
                })
            }
        } catch (error) {
            setState({
                ...state,
                loading: false,
                errorMessage: ERROR_UNKNOWN,
            })
        }
    }, [authProvider, state, identity, pincode])

    return (
        <Box>
            {errorMessage && (
                <Alert sx={{ py: 2 }} severity="error">
                    {errorMessage}
                </Alert>
            )}
            <Stepper activeStep={step} orientation="vertical">
                <Step key={0}>
                    <StepLabel>{config.labels.identify}</StepLabel>
                    <StepContent>
                        <Box
                            component="form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                gotEmail()
                                return false
                            }}
                        >
                            <TextField
                                {...config.input}
                                required
                                fullWidth
                                autoFocus
                                value={identity}
                                onChange={(e) => setIdentity(e.target.value)}
                                disabled={loading}
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={termsAccepted}
                                            onChange={(_, checked) =>
                                                setState({
                                                    ...state,
                                                    termsAccepted: checked,
                                                })
                                            }
                                        />
                                    }
                                    label={
                                        <Markdown
                                            markdown={phrase(
                                                'AUTH_LABEL_ACCEPT_TERMS',
                                                ''
                                            )}
                                        />
                                    }
                                />
                            </FormGroup>

                            <Typography />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading || !termsAccepted}
                            >
                                {config.labels.send}
                            </Button>
                        </Box>
                    </StepContent>
                </Step>
                <Step key={1}>
                    <StepLabel>{config.labels.sending}</StepLabel>
                    <StepContent>
                        <CircularProgress color="secondary" />
                    </StepContent>
                </Step>
                <Step key={2}>
                    <StepLabel>{config.labels.checkInbox}</StepLabel>
                </Step>
                <Step key={3}>
                    <StepLabel>{config.labels.enterPincode}</StepLabel>
                    <StepContent>
                        <Box
                            component="form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                gotPincode()
                                return false
                            }}
                        >
                            <TextField
                                type="text"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            H-
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    inputMode: 'numeric',
                                    pattern: '\\d{6,6}',
                                }}
                                margin="normal"
                                required
                                fullWidth
                                label={phrase('AUTH_LABEL_PINCODE', 'Pinkod')}
                                placeholder="123456"
                                autoComplete="off"
                                autoFocus
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                <Phrase
                                    id="AUTH_LABEL_LOGIN"
                                    value="Logga in"
                                />
                            </Button>
                        </Box>
                        {errorMessage && (
                            <Box>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    disabled={loading}
                                    onClick={() => {
                                        setPincode('')
                                        setState({
                                            loading: false,
                                            step: 0,
                                            termsAccepted: false,
                                            errorMessage: undefined,
                                        })
                                    }}
                                >
                                    {phrase('', 'Börja om från början')}
                                </Button>
                            </Box>
                        )}
                    </StepContent>
                </Step>
            </Stepper>
        </Box>
    )
}
