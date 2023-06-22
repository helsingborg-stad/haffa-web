import React, { FC, useCallback, useContext, useState } from 'react'
import { Layout } from '../layout'
import { Alert, Box, Button, InputAdornment, Step, StepContent, StepLabel, Stepper, TextField } from '@mui/material'
import { AuthContext } from './AuthContext'
import { PhraseContext } from '../phrases/PhraseContext'

/*
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

const createAuthProvider = (): AuthProvider => ({
	requestPincode: () => delay(250).then(() => 'accepted'),
	authenticate: () => delay(250)
		// .then(() => {throw new Error('apa')})
		.then(() => 'ett token'),
})
*/

export const AuthenticateView: FC = () => {
	const { setAuthentication, authProvider } = useContext(AuthContext)
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
	const { ERROR_UNKNOWN } = useContext(PhraseContext)

	const { step, loading, errorMessage } = state

	const gotEmail = useCallback(async () => {
		setState({
			...state,
			loading: true,
			errorMessage: '',
		})
		try {
			await authProvider.requestPincode(email)
			setState({
				...state,
				step: 2,
				loading: false,
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
			}
		} catch (error) {
			setState({
				...state,
				errorMessage: ERROR_UNKNOWN,
			})
		}

	}, [ authProvider, state ])

	return (
		<Layout
			renderAppbarControls={() => null}
			hideNavbar={true}>
			<Box>
				<Stepper activeStep={step} orientation='vertical'>
					<Step key={0}>
						<StepLabel>Ange din email</StepLabel>
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
									label="Email"
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
					Skicka mig ett email med engångskod
								</Button>
								{errorMessage && <Alert sx={{ py: 2 }} severity="error">{errorMessage}</Alert>}
							</Box>
						</StepContent>
					</Step>
					<Step key={1}>
						<StepLabel>Läs mailet från Haffa i din din inkorg</StepLabel>
					</Step>
					<Step key={2}>
						<StepLabel>Ange engångskoden från mailet</StepLabel>
						<StepContent>
							<Box component="form"
								onSubmit={e =>{
									e.preventDefault()
									gotPincode()
									return false
								}}>
								<TextField
									InputProps={{
										startAdornment: <InputAdornment position="start">H-</InputAdornment>,
									}}
									type="text"
									inputProps={{ 
										inputMode: 'numeric',
										pattern:'\\d{6,6}' }}
									
									margin="normal"
									required
									fullWidth
									label="Pinkod"
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
							Logga in
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