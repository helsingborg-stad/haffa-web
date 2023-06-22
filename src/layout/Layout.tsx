import React, { FC, PropsWithChildren } from 'react'
import { AppBar, Box, Button, Container, Fab, Grid, Toolbar, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Navbar } from './Navbar'
import { NavLink } from 'react-router-dom'

interface LayoutProps {
	renderAppbarControls?: () => React.JSX.Element|null
}

export const defaultRenderAppbarControls = (): React.JSX.Element => (<Button color='inherit' component={NavLink} to='/new-advert'><AddIcon/> Lägg till annons</Button>)

export const Layout: FC<LayoutProps & PropsWithChildren> = ({ renderAppbarControls = defaultRenderAppbarControls, children }) => (
	<Box sx={{ pb: 7 }}>
		<AppBar>
			<Toolbar>
				<Typography 
					variant="h6"
					component="div" sx={{ flexGrow: 1 }}>Haffa!</Typography>
				{renderAppbarControls?.()}
			</Toolbar>
		</AppBar>
		<Grid item
			xs={12}
			md={8}
			sx={{
				pt: 10,
				'& .markdown': {
					py: 3,
				},
			}}>
			<Container>
				{children}
			</Container>
		</Grid>
		<Box sx={{ pb: 8, position: 'fixed', bottom: 0, right: 0, 'z-index': 1000 }}>
			<Fab
				color="primary" aria-label="Lägg till annons"

			>
				<AddIcon />
			</Fab>
		</Box>
		<Navbar/>
	</Box>
)
