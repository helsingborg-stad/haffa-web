import React, { FC, useCallback, useContext, useState } from 'react'
import { Alert, Typography } from '@mui/material'
import { Advert, AdvertTerms, AdvertInput } from '../types'
import { AdvertsContext } from '../AdvertsContext'
import { useNavigate } from 'react-router-dom'
import { PhraseContext } from '../../phrases/PhraseContext'
import { sanitizeAdvertInput } from '../repository/mappers'
import { AdvertForm } from './AdvertForm'

export const EditAdvert: FC<{advert: Advert, terms: AdvertTerms}> = ({ advert: inputAdvert, terms }) => {
	const [ advert, setAdvert ] = useState<AdvertInput>(sanitizeAdvertInput(inputAdvert))
	const [ saving, setSaving ] = useState(false)
	const [ error, setError ] = useState(false)
	const { updateAdvert } = useContext(AdvertsContext)
	const { EDIT_ADVERT, ERROR_UNKNOWN } = useContext(PhraseContext)
	const navigate = useNavigate()

	const save = useCallback(async (a: AdvertInput) => {
		setSaving(true)
		setAdvert(a)
		try {
			const { id } = await updateAdvert(inputAdvert.id, a)
			setSaving(false)
			setError(false)
			navigate(`/advert/${id}`)
		} catch (error) {
			console.log(error)
			setError(true)
			setSaving(false)
		}
	},[advert])
	return (
		<>
			<Typography variant='h3'>{EDIT_ADVERT}</Typography>
			{error && <Alert severity='error'>{ERROR_UNKNOWN}</Alert>}
			<AdvertForm advert={advert} terms={terms} disabled={saving} onSave={save}/>
		</>)
}