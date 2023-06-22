import React, { FC, PropsWithChildren, useContext } from 'react'
import { AppBar, Box, Button, Container, Fab, Grid, Toolbar, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Navbar } from './Navbar'
import { NavLink } from 'react-router-dom'
import { Phrase } from '../phrases/Phrase'
import { PhraseContext } from '../phrases/PhraseContext'

interface LayoutProps {
	renderAppbarControls?: () => React.JSX.Element|null
}

export const defaultRenderAppbarControls = (): React.JSX.Element => (<Button color='inherit' component={NavLink} to='/new-advert'><AddIcon/> <Phrase key="CREATE_ADVERT" value="Lägg till annons"/></Button>)

export const Layout: FC<LayoutProps & PropsWithChildren> = ({ renderAppbarControls = defaultRenderAppbarControls, children }) => {
	const { phrase } = useContext(PhraseContext)
	return (
		<Box sx={{ pb: 7 }}>
			<AppBar>
				<Toolbar>
					<Typography 
						variant="h6"
						component="div" sx={{ flexGrow: 1 }}><Phrase key='APP_TITLE' value='Haffa!'/></Typography>
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
			<Navbar/>
		</Box>
	)
}