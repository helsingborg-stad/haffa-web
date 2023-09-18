import { HaffaUserRoles } from 'admin/types'
import { FC } from 'react'
import { Box, Chip, MenuItem, Select } from '@mui/material'
import { createRoleInputBindings } from './create-role-input-bindings'

export const SelectUserRoles: FC<{
    userRoles: HaffaUserRoles
    onChange: (roles: Partial<HaffaUserRoles>) => void
}> = ({ userRoles, onChange }) => {
    const [roleTuples, mapInputValueToTuples, toInputValue, fromInputValue] =
        createRoleInputBindings<HaffaUserRoles>((b) =>
            b
                .define('canEdit', 'Skapa annonser')
                .define('canArchive', 'Arkivera egna annonser')
                .define('canRemove', 'Ta bort egna annonser')
                .define('canReserve', 'Paxa annonser')
                .define('canCollect', 'Haffa annonser')
                .define('canCancelClaim', 'Hantera egna annonsers historik')
                .define(
                    'canManageAdverts',
                    'Hantera egna och andras annonser (admin)'
                )
                .define(
                    'canEditCategories',
                    'Hantera system kategorier (admin)'
                )
                .define(
                    'canEditLoginPolicies',
                    'Hantera systemets användare & behörigheter (admin)'
                )
        )
    return (
        <Select
            multiple
            fullWidth
            value={toInputValue(userRoles)}
            onChange={(e) => onChange(fromInputValue(e.target.value))}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {mapInputValueToTuples(selected).map(([prop, label]) => (
                        <Chip key={prop} label={label} />
                    ))}
                </Box>
            )}
        >
            {roleTuples.map(([prop, label]) => (
                <MenuItem key={prop} value={prop}>
                    {label}
                </MenuItem>
            ))}
        </Select>
    )
}
