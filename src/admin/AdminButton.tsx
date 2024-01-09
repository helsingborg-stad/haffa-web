import { Button } from '@mui/material'
import { AuthContext } from 'auth'
import { FC, useContext } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'

export const AdminButton: FC = () => {
    const { roles } = useContext(AuthContext)

    const showAdmin =
        roles.canEditApiKeys ||
        roles.canEditSystemCategories ||
        roles.canEditSystemLoginPolicies ||
        roles.canEditTerms ||
        roles.canRunSystemJobs ||
        roles.canManageContent ||
        roles.canManageLocations ||
        roles.canSeeSystemStatistics

    return showAdmin ? (
        <Button startIcon={<SettingsIcon />} href="/admin" color="inherit" />
    ) : null
}
