import AdminIcon from '@mui/icons-material/Lock'
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Select,
} from '@mui/material'
import type { HaffaUserRoles } from 'auth'
import { PhraseContext } from 'phrases/PhraseContext'
import { type FC, useContext, useMemo } from 'react'
import { createDefaultRoleInputBindings } from '../create-role-input-bindings'

export const SelectUserRoles: FC<{
    userRoles: HaffaUserRoles
    onChange: (roles: Partial<HaffaUserRoles>) => void
    readOnly?: boolean
}> = ({ userRoles, onChange, readOnly }) => {
    const { phrase } = useContext(PhraseContext)
    const [roleTuples, mapInputValueToTuples, toInputValue, fromInputValue] =
        useMemo(() => createDefaultRoleInputBindings(phrase), [phrase])

    return (
        <FormControl fullWidth>
            <InputLabel>
                {phrase('ROLES_SELECT_LABEL', 'Behörigheter')}
            </InputLabel>
            <Select
                readOnly={readOnly}
                multiple
                fullWidth
                label={phrase('ROLES_SELECT_LABEL', 'Behörigheter')}
                value={toInputValue(userRoles)}
                onChange={(e) => onChange(fromInputValue(e.target.value))}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {mapInputValueToTuples(selected).map(
                            ([prop, label, isAdmin]) => (
                                <Chip
                                    key={prop as string}
                                    label={label}
                                    icon={isAdmin ? <AdminIcon /> : undefined}
                                />
                            )
                        )}
                    </Box>
                )}
            >
                {roleTuples.map(([prop, label, isAdmin]) => (
                    <MenuItem key={prop as string} value={prop as string}>
                        <ListItemIcon>{isAdmin && <AdminIcon />}</ListItemIcon>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
