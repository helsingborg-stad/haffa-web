import React, { FC, PropsWithChildren, useCallback, useContext, useState } from 'react'
import { Alert, Box, Button, Grid, GridProps } from '@mui/material'
import { AdvertTerms, CreateAdvertInput } from '../types'
import { useFormControls } from '../../hooks/use-form-controls'
import SaveIcon from '@mui/icons-material/Save'
import { AdvertsContext } from '../AdvertsContext'
import { useNavigate } from 'react-router-dom'
import { PhraseContext } from '../../phrases/PhraseContext'
import { createEmptyCreateAdvertInput } from '../repository/mappers'

const Row: FC<PropsWithChildren & GridProps> = (props) => <Grid container spacing={2} sx={{ pt: 2 }} {...props}>{props.children}</Grid>
const Cell: FC<PropsWithChildren & GridProps> = (props) => <Grid item {...props}>{props.children}</Grid>

const AdvertForm: FC<{
	terms: AdvertTerms,
	advert: CreateAdvertInput, 
	disabled: boolean, 
	onSave: (advert: CreateAdvertInput) => void
}> = ({ advert, terms, onSave, disabled }) => {
	const { model, simplifiedFactory: { select, textField } } = useFormControls<CreateAdvertInput>(advert)
	const { SAVE_ADVERT } = useContext(PhraseContext)

	const makeOptions = (values: string[]) => values.map(v => ({ label: v, value: v }))

	const layout = [
		[
			() => textField('title', 'Titel',{ required: true, disabled  }),
		], [
			() => textField('description', 'Beskrivning',{ required: true, multiline: true, minRows: 4, disabled }),
		],
		[
			() => select('unit', 'Enhet', makeOptions(terms.unit)),
			() => select('material', 'Material', makeOptions(terms.material)),
			() => select('condition', 'Skick', makeOptions(terms.condition)),
			() => select('usage', 'Användningsområde', makeOptions(terms.usage)),
		],
	]
	return (
		<Box component="form" onSubmit={e => {
			e.preventDefault()
			onSave(model)
			return false}}>
			{layout.map((row, rowIndex) => (
				<Row key={rowIndex}>
					{row.map((cell, cellIndex) => (
						<Cell key={cellIndex}>{cell()}</Cell>
					))}

				</Row>))}
			<Row justifyContent="flex-end">
				<Cell>
					<Button type="submit" variant="contained" startIcon={<SaveIcon/>} disabled={disabled}>{SAVE_ADVERT}</Button>
				</Cell>
			</Row>
		</Box>)
}

export const CreateAdvert: FC<{terms: AdvertTerms}> = ({ terms }) => {
	const [ advert, setAdvert ] = useState<CreateAdvertInput>(createEmptyCreateAdvertInput())
	const [ saving, setSaving ] = useState(false)
	const [ error, setError ] = useState(false)
	const { createAdvert } = useContext(AdvertsContext)
	const { ERROR_UNKNOWN } = useContext(PhraseContext)
	const navigate = useNavigate()

	const save = useCallback(async (a: CreateAdvertInput) => {
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
			{error && <Alert severity='error'>{ERROR_UNKNOWN}</Alert>}
			<AdvertForm advert={advert} terms={terms} disabled={saving} onSave={save}/>
		</>)
}