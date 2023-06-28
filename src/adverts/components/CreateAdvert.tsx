import React, { FC, useCallback, useContext, useState } from 'react'
import { Alert, Typography } from '@mui/material'
import { AdvertTerms, AdvertInput } from '../types'
import { AdvertsContext } from '../AdvertsContext'
import { useNavigate } from 'react-router-dom'
import { PhraseContext } from '../../phrases/PhraseContext'
import { createEmptyCreateAdvertInput } from '../repository/mappers'
import { AdvertForm } from './AdvertForm'

export const CreateAdvert: FC<{terms: AdvertTerms}> = ({ terms }) => {
	const [ advert, setAdvert ] = useState<AdvertInput>(createEmptyCreateAdvertInput())
	const [ saving, setSaving ] = useState(false)
	const [ error, setError ] = useState(false)
	const { createAdvert } = useContext(AdvertsContext)
	const { CREATE_ADVERT, ERROR_UNKNOWN } = useContext(PhraseContext)
	const navigate = useNavigate()

	const save = useCallback(async (a: AdvertInput) => {
		setSaving(true)
		setAdvert(a)
		try {
			const { id } = await createAdvert(a)
			setSaving(false)
			setError(false)
			navigate(`/advert/${id}`)
		} catch (error) {
			setError(true)
			setSaving(false)
		}
	},[advert])
	return (
		<>
			<Typography variant='h3'>{CREATE_ADVERT}</Typography>
			{error && <Alert severity='error'>{ERROR_UNKNOWN}</Alert>}
			<AdvertForm advert={advert} terms={terms} disabled={saving} onSave={save}/>
		</>)
}