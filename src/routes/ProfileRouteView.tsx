import { FC, useContext, useMemo } from 'react'
import { Layout } from '../layout'
import { Box, Button } from '@mui/material'
import { AuthContext } from '../auth'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

export const ProfileRouteView: FC = () => {
	const { signout, token } = useContext(AuthContext)
	const navigate = useNavigate()
	const decoded = useMemo(() => jwtDecode(token), [token])
	return (
		<Layout>
			<Box>
				<pre>
					<code>
						{JSON.stringify(decoded, null, 2)}
					</code>
				</pre>
				<Button
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					onClick={() => {
						navigate('/')
						signout()
					}}
				>Logga ut</Button>

			</Box>
		</Layout>
	)
}
