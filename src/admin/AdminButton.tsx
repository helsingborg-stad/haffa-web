import { Button, Menu, MenuItem } from '@mui/material'
import { AuthContext } from 'auth'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import AdminIcon from '@mui/icons-material/Lock'
import { NavLink } from 'react-router-dom'
import { PhraseContext } from 'phrases/PhraseContext'

export const AdminButton: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const { roles } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = !!anchorEl

    const makeMenuItem = useCallback(
        (to: string, label: string) => (
            <MenuItem key={to}>
                <Button
                    fullWidth
                    component={NavLink}
                    to={to}
                    onClick={() => setAnchorEl(null)}
                >
                    {label}
                </Button>
            </MenuItem>
        ),
        [setAnchorEl]
    )
    const adminMenuLinks = useMemo(
        () =>
            [
                roles.canEditSystemCategories
                    ? makeMenuItem(
                          '/admin/categories',
                          phrase('', 'Kategorier')
                      )
                    : null,
                roles.canEditSystemLoginPolicies
                    ? makeMenuItem(
                          '/admin/logins',
                          phrase('', 'Användare & behörigheter')
                      )
                    : null,
            ].filter((v) => v),
        [phrase, roles]
    )

    if (adminMenuLinks.length === 0) {
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
                {adminMenuLinks}
            </Menu>
        </>
    )
}