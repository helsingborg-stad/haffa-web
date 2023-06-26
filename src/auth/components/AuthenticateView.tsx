import React, { FC, useCallback, useContext, useState } from 'react'
import { Layout } from '../../layout'
import { Alert, Box, Button, CircularProgress, InputAdornment, Step, StepContent, StepLabel, Stepper, TextField } from '@mui/material'
import { AuthContext } from '../AuthContext'
import { PhraseContext } from '../../phrases/PhraseContext'
import { Phrase } from '../../phrases/Phrase'

const MIN_WAIT_FOR_LOGIN_MS = 1000

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const AuthenticateView: FC = () => {
	const { setAuthentication, authProvider } = useContext(AuthContext)
	const { phrase, ERROR_UNKNOWN } = useContext(PhraseContext)
	const [ email, setEmail ] = useState('')
	const [ pincode, setPincode ] = useState('')
	const [ state, setState ] = useState<{
		loading: boolean,
		step: number,
		errorMessage?: string
	}>({
		loading: false,
		step: 0,
	})

	const { step, loading, errorMessage } = state

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
			await Promise.all([ authProvider.requestPincode(email), delay(MIN_WAIT_FOR_LOGIN_MS) ])
			setState({
				...state,
				step: 3,
				loading: false,
				errorMessage: '',
			})
		} catch(error) {
			setState({
				...state,
				loading: false,
				errorMessage: ERROR_UNKNOWN,
			})
		}
	}, [ authProvider, state, email ])
	const gotPincode = useCallback(async () => {
		setState({
			...state,
			loading: true,
			errorMessage: '',
		})
		try {
			const token = await authProvider.authenticate(email, pincode)
			if (token) {
				console.log({ token })
				setAuthentication({ token })
			} else {
				setState({
					...state,
					loading: false,
					errorMessage: phrase('AUTH_LOGIN_FAILED', 'Vi kunde inte logga in dig. Försök igen.'),
				})
			}
		} catch (error) {
			setState({
				...state,
				loading: true,
				errorMessage: ERROR_UNKNOWN,
			})
		}

	}, [ authProvider, state, email, pincode ])

	return (
		<Layout
			renderAppbarControls={() => null}
			hideNavbar={true}>
			<Box>
				<Stepper activeStep={step} orientation='vertical'>
					<Step key={0}>
						<StepLabel><Phrase id="AUTH_LABEL_ENTER_EMAIL" value="Ange din email"/></StepLabel>
						<StepContent>
							<Box component="form" onSubmit={e => {
								e.preventDefault()
								gotEmail()
								return false
							}}>
								<TextField
									type="email"
									required
									fullWidth
									label={phrase('AUTH_LABEL_EMAIL','Email')}
									placeholder='jag-själv@min-organisation.se'
									autoComplete="email"
									autoFocus
									value={email}
									onChange={e => setEmail(e.target.value)}
									disabled={loading}
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
									
									disabled={loading}
								>
									<Phrase id="AUTH_LABEL_SEND_EMAIL" value="Skicka mig ett email med engångskod" />
								</Button>
								{errorMessage && <Alert sx={{ py: 2 }} severity="error">{errorMessage}</Alert>}
							</Box>
						</StepContent>
					</Step>
					<Step key={1}>
						<StepLabel><Phrase id="AUTH_LABEL_SENDING_EMAIL" value="Vi skickar ett mail till dig med en engångskod"/></StepLabel>
						<StepContent><CircularProgress color="secondary" /></StepContent>
					</Step>
					<Step key={2}>
						<StepLabel><Phrase id="AUTH_LABEL_READ_YOUR_EMAIL" value="Läs mailet från Haffa i din din inkorg"/></StepLabel>
					</Step>
					<Step key={3}>
						<StepLabel><Phrase id="AUTH_LABEL_ENTER_PINCODE" value="Ange engångskoden från mailet" /></StepLabel>
						<StepContent>
							<Box component="form"
								onSubmit={e =>{
									e.preventDefault()
									gotPincode()
									return false
								}}>
								<TextField
									type="text"
									InputProps={{
										startAdornment: <InputAdornment position="start">H-</InputAdornment>,
									}}
									
									inputProps={{ 
										inputMode: 'numeric',
										pattern:'\\d{6,6}' }}
									
									margin="normal"
									required
									fullWidth
									label={phrase('AUTH_LABEL_PINCODE','Pinkod')}
									placeholder='123456'
									autoComplete="off"
									autoFocus
									value={pincode}
									onChange={e => setPincode(e.target.value)}
									disabled={loading}
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
									disabled={loading}
								>
									<Phrase id="AUTH_LABEL_LOGIN" value="Logga in" />
								</Button>
							</Box>
							{errorMessage && <Alert sx={{ py: 2 }} severity="error">{errorMessage}</Alert>}
						</StepContent>
					</Step>
				</Stepper>
			</Box>
		</Layout>
	)
}