import { Box, Button, Grid, GridProps } from '@mui/material'
import { FC, PropsWithChildren, useContext, useMemo } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { AdvertTerms, AdvertInput } from '../types'
import { useFormControls } from '../../hooks/use-form-controls'
import { PhraseContext } from '../../phrases/PhraseContext'

const Row: FC<PropsWithChildren & GridProps> = (props) => <Grid container spacing={2} sx={{ pt: 2 }} {...props}>{props.children}</Grid>
const Cell: FC<PropsWithChildren & GridProps> = (props) => <Grid item {...props}>{props.children}</Grid>

export const AdvertForm: FC<{
	terms: AdvertTerms,
	advert: AdvertInput, 
	disabled: boolean, 
	onSave: (advert: AdvertInput) => void
}> = ({ advert, terms, onSave, disabled }) => {
	const { model, factory, simplifiedFactory: { select, textField } } = useFormControls<AdvertInput>(advert)
	const { SAVE_ADVERT } = useContext(PhraseContext)

	const makeOptions = (values: string[]) => values.map(v => ({ label: v, value: v }))

	const layout = useMemo(() => ([
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

		...model.images.map(({ url }, index) => [() => <img key={index} src={url}/>]),

		[
			// append image
			() => factory.imagePicker(
				() => '',
				url => ({ images: [ ...model.images,{ url } ] })
			),
		],

		
	]), [model])
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
