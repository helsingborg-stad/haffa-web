import { FC, useContext } from 'react'
import { Layout } from '../layout'
import { Box, Button } from '@mui/material'
import { AuthContext } from '../auth'

export const ProfileRouteView: FC = () => {
	const { signout } = useContext(AuthContext)
	return (
		<Layout>
			<Box>
				<Button
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					onClick={signout}
				>Logga ut</Button>

			</Box>
		</Layout>
	)
}
