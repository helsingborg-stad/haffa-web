import { HaffaUserRoles } from 'admin/types'
import { FC, useContext, useMemo } from 'react'
import { Box, Chip, ListItemIcon, MenuItem, Select } from '@mui/material'
import { PhraseContext } from 'phrases/PhraseContext'
import AdminIcon from '@mui/icons-material/Lock'
import { createRoleInputBindings } from './create-role-input-bindings'

export const SelectUserRoles: FC<{
    userRoles: HaffaUserRoles
    onChange: (roles: Partial<HaffaUserRoles>) => void
}> = ({ userRoles, onChange }) => {
    const { phrase } = useContext(PhraseContext)
    const [roleTuples, mapInputValueToTuples, toInputValue, fromInputValue] =
        useMemo(
            () =>
                createRoleInputBindings<HaffaUserRoles>((b) =>
                    b
                        .define(
                            'canEditOwnAdverts',
                            phrase('', 'Skapa annonser')
                        )
                        .define(
                            'canArchiveOwnAdverts',
                            phrase('', 'Arkivera egna annonser')
                        )
                        .define(
                            'canRemoveOwnAdverts',
                            phrase('', 'Ta bort egna annonser')
                        )
                        .define(
                            'canReserveAdverts',
                            phrase('', 'Paxa annonser')
                        )
                        .define(
                            'canCollectAdverts',
                            phrase('', 'Haffa annonser')
                        )
                        .define(
                            'canManageOwnAdvertsHistory',
                            phrase('', 'Hantera egna annonsers historik')
                        )
                        .define(
                            'canManageAllAdverts',
                            phrase(
                                '',
                                'Hantera egna och andras annonser (admin)'
                            ),
                            true
                        )
                        .define(
                            'canEditSystemCategories',
                            phrase('', 'Hantera system kategorier (admin)'),
                            true
                        )
                        .define(
                            'canEditSystemLoginPolicies',
                            phrase(
                                '',
                                'Hantera systemets användare & behörigheter (admin)'
                            ),
                            true
                        )
                        .define(
                            'canRunSystemJobs',
                            phrase('', 'Agent som får köra jobb (admin)'),
                            true
                        )
                ),
            [phrase]
        )

    return (
        <Select
            multiple
            fullWidth
            value={toInputValue(userRoles)}
            onChange={(e) => onChange(fromInputValue(e.target.value))}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {mapInputValueToTuples(selected).map(
                        ([prop, label, isAdmin]) => (
                            <Chip
                                key={prop}
                                label={label}
                                // eslint-disable-next-line react/jsx-no-useless-fragment
                                icon={isAdmin ? <AdminIcon /> : <></>}
                            />
                        )
                    )}
                </Box>
            )}
        >
            {roleTuples.map(([prop, label, isAdmin]) => (
                <MenuItem key={prop} value={prop}>
                    <ListItemIcon>{isAdmin && <AdminIcon />}</ListItemIcon>
                    {label}
                </MenuItem>
            ))}
        </Select>
    )
}