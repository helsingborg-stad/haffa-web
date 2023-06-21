import { AppBar, Box, Container, Grid, Toolbar, Typography } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { Navbar } from './Navbar'

export const Layout: FC<PropsWithChildren> = ({ children }) => (
	<Box sx={{ pb: 7 }}>
		<AppBar>
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Haffa!
				</Typography>
			</Toolbar>
		</AppBar>
		<Grid item
			xs={12}
			md={8}
			sx={{
				pt: 8,
				'& .markdown': {
					py: 3,
				},
			}}>
			<Container>
				{children}
			</Container>
		</Grid>
		<Navbar/>
	</Box>
)
