import { BottomNavigation, BottomNavigationAction, Link, Paper } from '@mui/material'
import { FC } from 'react'
import HomeIcon from '@mui/icons-material/Home'
export const Navbar: FC = () => (
	<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
		<BottomNavigation
			showLabels
		>
			<BottomNavigationAction label="Hem" icon={<HomeIcon/>} component={Link} href='/'/>
		</BottomNavigation>
	</Paper>
)