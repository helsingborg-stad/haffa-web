import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { FC, useContext } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import { NavLink } from 'react-router-dom'
import { PhraseContext } from '../phrases/PhraseContext'
export const Navbar: FC = () => {
	const { phrase } = useContext(PhraseContext)
	return (
		<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
			<BottomNavigation
				showLabels
			>
				<BottomNavigationAction
					label={phrase('NAVBAR_HOME', 'Hem')}
					icon={<HomeIcon/>} 
					component={NavLink} 
					to='/'
				/>
				<BottomNavigationAction
					label={phrase('NAVBAR_MY_ADVERTS', 'Mina annonser')}
					icon={<HomeIcon/>} 
					component={NavLink} 
					to='/my-adverts'
				/>
			</BottomNavigation>
		</Paper>
	)}