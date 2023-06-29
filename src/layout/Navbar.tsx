import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { FC, useContext } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import { NavLink } from 'react-router-dom'
import { PhraseContext } from '../phrases/PhraseContext'

export const Navbar: FC = () => {
    const { NAV_HOME, NAV_MY_ADVERTS, NAV_PROFILE } = useContext(PhraseContext)
    return (
        <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
        >
            <BottomNavigation showLabels>
                <BottomNavigationAction
                    label={NAV_HOME}
                    icon={<HomeIcon />}
                    component={NavLink}
                    to="/"
                />
                <BottomNavigationAction
                    label={NAV_MY_ADVERTS}
                    icon={<HomeIcon />}
                    component={NavLink}
                    to="/my-adverts"
                />
                <BottomNavigationAction
                    label={NAV_PROFILE}
                    icon={<PersonIcon />}
                    component={NavLink}
                    to="/profile"
                />
            </BottomNavigation>
        </Paper>
    )
}
