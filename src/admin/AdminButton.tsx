import SettingsIcon from '@mui/icons-material/Settings'
import { Button } from '@mui/material'
import { AuthContext } from 'auth'
import { type FC, useContext } from 'react'

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
        <Button nativeButton={false} startIcon={<SettingsIcon />} href="/admin" color="inherit" />
    ) : null
}
