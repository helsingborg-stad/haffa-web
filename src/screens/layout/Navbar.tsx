import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { FC } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import { NavLink } from 'react-router-dom'
export const Navbar: FC = () => (
	<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
		<BottomNavigation
			showLabels
		>
			<BottomNavigationAction
				label="Hem" 
				icon={<HomeIcon/>} 
				component={NavLink} 
				to='/'
			/>
			<BottomNavigationAction
				label="Härifrån" 
				icon={<HomeIcon/>} 
				component={NavLink} 
				to='/bort'
			/>
		</BottomNavigation>
	</Paper>
)