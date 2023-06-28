import { Box, Button, ButtonGroup, Grid, GridProps, IconButton } from '@mui/material'
import { FC, PropsWithChildren, useCallback, useContext, useMemo } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import { AdvertTerms, AdvertInput } from '../types'
import { useFormControls } from '../../hooks/use-form-controls'
import { PhraseContext } from '../../phrases/PhraseContext'

const swapArrayItems = <T,>(list: T[], index1: number, index2: number): T[] => {
	const l = [...list]
	const e = l[index1]
	l[index1] = l[index2]
	l[index2] = e
	return l
}

const Row: FC<PropsWithChildren & GridProps> = (props) => <Grid container spacing={2} sx={{ pt: 2 }} {...props}>{props.children}</Grid>
const Cell: FC<PropsWithChildren & GridProps> = (props) => <Grid item sx={{ flexGrow: 1 }} {...props}>{props.children}</Grid>

const ImageContainer: FC<PropsWithChildren> = ({ children }) => <Grid container spacing={2}>{children}</Grid>
const Image: FC<{
	url: string,
	onRemove?: () => void,
	onMoveup?: () => void
	onMovedown?: () => void
}> = ({ url, onRemove, onMoveup, onMovedown }) => (
	<Grid item xs={12} sm={6} sx={{ position: 'relative' }}>
		<Box component='img' src={url} sx={{ objectFit: 'contain', width:'100%', height: '100%' }}/>
		<Box sx={{ position: 'absolute', top: 0, left: 0 }}>
			<ButtonGroup>
				{onRemove && <IconButton onClick={onRemove}><DeleteIcon/></IconButton>}
				{onMoveup && <IconButton onClick={onMoveup}><MoveUpIcon/></IconButton>}
				{onMovedown && <IconButton onClick={onMovedown}><MoveDownIcon/></IconButton>}
			</ButtonGroup>
		</Box>
		
	</Grid>)

export const AdvertForm: FC<{
	terms: AdvertTerms,
	advert: AdvertInput, 
	disabled: boolean, 
	onSave: (advert: AdvertInput) => void
}> = ({ advert, terms, onSave, disabled }) => {
	const { model, patchModel, factory, simplifiedFactory: { select, textField } } = useFormControls<AdvertInput>(advert)
	const { SAVE_ADVERT } = useContext(PhraseContext)

	const makeOptions = (values: string[]) => values.map(v => ({ label: v, value: v }))

	const removeImage = useCallback((index: number) => () => patchModel({
		images: model.images.filter((_, i) => i !== index),
	}), [ model, patchModel ])

	const moveImageUp = useCallback((index: number) => {
		if (index === 0) {
			return
		}
		return () => patchModel({
			images: swapArrayItems(model.images, index, index-1),
		})
	}, [ model, patchModel ])

	const moveImageDown = useCallback((index: number) => {
		if (index >= model.images.length - 1) {
			return
		}
		return () => patchModel({
			images: swapArrayItems(model.images, index, index+1),
		})
	}, [ model, patchModel ])

	const layout = useMemo(() => ([
		[
			() => textField('title', 'Titel',{ required: true, disabled, fullWidth: true  }),
		], [
			() => textField('description', 'Beskrivning',{ required: true, multiline: true, minRows: 4, disabled, fullWidth: true }),
		],
		[
			() => select('unit', 'Enhet', makeOptions(terms.unit)),
			() => select('material', 'Material', makeOptions(terms.material)),
			() => select('condition', 'Skick', makeOptions(terms.condition)),
			() => select('usage', 'Användningsområde', makeOptions(terms.usage)),
		],

		[
			() => (
				<ImageContainer>
					{model.images.map(({ url }, index) => <Image 
						key={url} url={url} 
						onRemove={removeImage(index)}
						onMoveup={moveImageUp(index)}
						onMovedown={moveImageDown(index)}
					/>)}
				</ImageContainer>),
		],

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
