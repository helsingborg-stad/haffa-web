import { FC, useCallback, useContext, useState } from 'react'
import { Alert, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ProfileContext } from 'profile/ProfileContext'
import { sanitizeProfileInput } from 'profile/repository/mappers'
import { Terms } from 'terms/types'
import { Profile, ProfileInput } from '../types'
import { PhraseContext } from '../../phrases/PhraseContext'
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
    const { EDIT_PROFILE, ERROR_UNKNOWN } = useContext(PhraseContext)
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
        [profile]
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
