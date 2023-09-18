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
                .define('canEditOwnAdverts', 'Skapa annonser')
                .define('canArchiveOwnAdverts', 'Arkivera egna annonser')
                .define('canRemoveOwnAdverts', 'Ta bort egna annonser')
                .define('canReserveAdverts', 'Paxa annonser')
                .define('canCollectAdverts', 'Haffa annonser')
                .define(
                    'canManageOwnAdvertsHistory',
                    'Hantera egna annonsers historik'
                )
                .define(
                    'canManageAllAdverts',
                    'Hantera egna och andras annonser (admin)'
                )
                .define(
                    'canEditSystemCategories',
                    'Hantera system kategorier (admin)'
                )
                .define(
                    'canEditSystemLoginPolicies',
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
