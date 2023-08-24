import { Button, Menu, MenuItem } from '@mui/material'
import { AuthContext } from 'auth'
import { FC, useContext, useState } from 'react'
import AdminIcon from '@mui/icons-material/Lock'
import { NavLink } from 'react-router-dom'
import { PhraseContext } from 'phrases/PhraseContext'

export const AdminButton: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const { isAdmin } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = !!anchorEl
    if (!isAdmin) {
        return null
    }
    return (
        <>
            <Button
                color="inherit"
                startIcon={<AdminIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                Admin
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem>
                    <Button
                        component={NavLink}
                        to="/admin/categories"
                        onClick={() => setAnchorEl(null)}
                    >
                        {phrase('', 'Kategorier')}
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button
                        component={NavLink}
                        to="/admin/logins"
                        onClick={() => setAnchorEl(null)}
                    >
                        {phrase('', 'Användare & behörigheter')}
                    </Button>
                </MenuItem>
            </Menu>
        </>
    )
}
