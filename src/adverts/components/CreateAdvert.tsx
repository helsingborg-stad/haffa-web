import { FC, useCallback, useContext, useState } from 'react'
import { Alert, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AdvertTerms, AdvertInput } from '../types'
import { AdvertsContext } from '../AdvertsContext'
import { PhraseContext } from '../../phrases/PhraseContext'
import { createEmptyCreateAdvertInput } from '../repository/mappers'
import { AdvertForm } from './AdvertForm'

export const CreateAdvert: FC<{ terms: AdvertTerms }> = ({ terms }) => {
    const [advert, setAdvert] = useState<AdvertInput>(
        createEmptyCreateAdvertInput()
    )
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const { createAdvert } = useContext(AdvertsContext)
    const { CREATE_ADVERT, ERROR_UNKNOWN } = useContext(PhraseContext)
    const navigate = useNavigate()

    const save = useCallback(
        async (a: AdvertInput) => {
            setSaving(true)
            setAdvert(a)
            try {
                const result = await createAdvert(a)
                setSaving(false)
                setError(result.status ? result.status.message : '')
                if (!result.status && result.advert) {
                    navigate(`/advert/${result.advert.id}`)
                }
            } catch (error) {
                setError(ERROR_UNKNOWN)
                setSaving(false)
            }
        },
        [advert]
    )
    return (
        <>
            <Typography variant="h3">{CREATE_ADVERT}</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <AdvertForm
                advert={advert}
                terms={terms}
                disabled={saving}
                onSave={save}
            />
        </>
    )
}
