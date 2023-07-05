import { FC, useCallback, useContext, useState } from 'react'
import { Alert, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Advert, AdvertTerms, AdvertInput } from '../types'
import { AdvertsContext } from '../AdvertsContext'
import { PhraseContext } from '../../phrases/PhraseContext'
import { sanitizeAdvertInput } from '../repository/mappers'
import { AdvertForm } from './AdvertForm'

export const EditAdvert: FC<{ advert: Advert; terms: AdvertTerms }> = ({
    advert: inputAdvert,
    terms,
}) => {
    const [advert, setAdvert] = useState<AdvertInput>(
        sanitizeAdvertInput(inputAdvert)
    )
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const { updateAdvert } = useContext(AdvertsContext)
    const { EDIT_ADVERT, ERROR_UNKNOWN } = useContext(PhraseContext)
    const navigate = useNavigate()

    const save = useCallback(
        async (a: AdvertInput) => {
            setSaving(true)
            setAdvert(a)
            try {
                const result = await updateAdvert(inputAdvert.id, a)
                setSaving(false)
                setError(result.status ? result.status.message : '')
                if (result.status) {
                    setAdvert(sanitizeAdvertInput(result.advert || advert))
                } else if (result.advert) {
                    navigate(`/advert/${result.advert.id}`)
                }
            } catch (error) {
                console.log(error)
                setError(ERROR_UNKNOWN)
                setSaving(false)
            }
        },
        [advert]
    )
    return (
        <>
            <Typography variant="h3">{EDIT_ADVERT}</Typography>
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
