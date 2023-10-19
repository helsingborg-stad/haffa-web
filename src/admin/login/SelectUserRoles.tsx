import { FC, useContext, useMemo } from 'react'
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Select,
} from '@mui/material'
import { PhraseContext } from 'phrases/PhraseContext'
import AdminIcon from '@mui/icons-material/Lock'
import { HaffaUserRoles } from 'auth'
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
                            phrase(
                                'ROLES_CAN_EDIT_OWN_ADVERTS',
                                'Skapa annonser'
                            )
                        )
                        .define(
                            'canArchiveOwnAdverts',
                            phrase(
                                'ROLES_CAN_ARCHIVE_OWN_ADVERTS',
                                'Arkivera egna annonser'
                            )
                        )
                        .define(
                            'canRemoveOwnAdverts',
                            phrase(
                                'ROLES_CAN_REMOVE_OWN_ADVERTS',
                                'Ta bort egna annonser'
                            )
                        )
                        .define(
                            'canReserveAdverts',
                            phrase(
                                'ROLES_CAN_RESERVE_ADVERTS',
                                'Reservera annonser'
                            )
                        )
                        .define(
                            'canCollectAdverts',
                            phrase(
                                'ROLES_CAN_COLLECT_ADVERTS',
                                'Hämta ut annonser'
                            )
                        )
                        .define(
                            'canManageOwnAdvertsHistory',
                            phrase(
                                'ROLES_CAN_MANAGE_OWN_ADVERTS_HISTORY',
                                'Hantera egna annonsers historik'
                            )
                        )
                        .define(
                            'canManageAllAdverts',
                            phrase(
                                'ROLES_CAN_MANAGE_ALL_ADVERTS',
                                'Hantera egna och andras annonser (admin)'
                            ),
                            true
                        )
                        .define(
                            'canEditTerms',
                            phrase(
                                'ROLES_CAN_EDIT_TERMS',
                                'Hantera definitioner (admin)'
                            ),
                            true
                        )
                        .define(
                            'canEditSystemCategories',
                            phrase(
                                'ROLES_CAN_EDIT_SYSTEM_CATEGORIES',
                                'Hantera system kategorier (admin)'
                            ),
                            true
                        )
                        .define(
                            'canEditSystemLoginPolicies',
                            phrase(
                                'ROLES_CAN_EDIT_SYSTEM_LOGIN_POLICIES',
                                'Hantera systemets användare & behörigheter (admin)'
                            ),
                            true
                        )
                        .define(
                            'canEditApiKeys',
                            phrase(
                                'ROLES_CAN_EDIT_API_KEYS',
                                'Hantera API nycklar'
                            ),
                            true
                        )
                        .define(
                            'canRunSystemJobs',
                            phrase(
                                'ROLES_CAN_RUN_SYSTEM_JOBS',
                                'Agent som får köra jobb (admin)'
                            ),
                            true
                        )
                ),
            [phrase]
        )

    return (
        <FormControl fullWidth>
            <InputLabel>
                {phrase('ROLES_SELECT_LABEL', 'Behörigheter')}
            </InputLabel>
            <Select
                multiple
                fullWidth
                label={phrase('ROLES_SELECT_LABEL', 'Behörigheter')}
                placeholder={phrase('ROLES_SELECT_LABEL', 'Behörigheter')}
                value={toInputValue(userRoles)}
                onChange={(e) => onChange(fromInputValue(e.target.value))}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {mapInputValueToTuples(selected).map(
                            ([prop, label, isAdmin]) => (
                                <Chip
                                    key={prop as string}
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
                    <MenuItem key={prop as string} value={prop as string}>
                        <ListItemIcon>{isAdmin && <AdminIcon />}</ListItemIcon>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
