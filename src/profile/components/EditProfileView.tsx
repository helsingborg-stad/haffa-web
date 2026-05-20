import { Alert, Typography } from '@mui/material'
import { ProfileContext } from 'profile/ProfileContext'
import { sanitizeProfileInput } from 'profile/repository/mappers'
import { type FC, useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Terms } from 'terms/types'
import { PhraseContext } from '../../phrases/PhraseContext'
import type { Profile, ProfileInput } from '../types'
import { ProfileForm } from './ProfileForm'

export const EditProfileView: FC<{ profile: Profile; terms: Terms }> = ({
    profile: inputProfile,
    terms,
}) => {
    const [profile, setProfile] = useState<ProfileInput>(
        sanitizeProfileInput(inputProfile)
    )
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(false)
    const { updateProfile } = useContext(ProfileContext)
    const { PROFILE_EDIT: EDIT_PROFILE, ERROR_UNKNOWN } =
        useContext(PhraseContext)
    const navigate = useNavigate()

    const save = useCallback(
        async (p: ProfileInput) => {
            setSaving(true)
            setProfile(p)
            try {
                await updateProfile(p)
                setSaving(false)
                setError(false)
                navigate(`/profile`)
            } catch (error) {
                console.log(error)
                setError(true)
                setSaving(false)
            }
        },
        [updateProfile, navigate]
    )
    return (
        <>
            <Typography variant="h3">{EDIT_PROFILE}</Typography>
            {error && <Alert severity="error">{ERROR_UNKNOWN}</Alert>}
            <ProfileForm
                profile={profile}
                terms={terms}
                disabled={saving}
                onSave={save}
            />
        </>
    )
}
