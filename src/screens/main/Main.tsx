import { FC, PropsWithChildren } from 'react'
import { Layout } from './Layout'
import { Box, CssBaseline, Typography } from '@mui/material'
import { Navbar } from './Navbar'

export const Main: FC<PropsWithChildren> = ({ children }) => (
	<Box sx={{ pb: 7 }}>
		<CssBaseline/>
		<Layout>
			<Typography variant="h6" gutterBottom>Haffa</Typography>
			{children}
		</Layout>
		<Navbar/>
	</Box>)