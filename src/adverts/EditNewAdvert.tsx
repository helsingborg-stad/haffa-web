import React, { FC, PropsWithChildren } from 'react'
import { Box, Button, Grid, GridProps } from '@mui/material'
import { Advert } from '../lib/adverts/types'
import { useFormControls } from '../hooks/use-form-controls'
import SaveIcon from '@mui/icons-material/Save'

const Row: FC<PropsWithChildren & GridProps> = (props) => <Grid container spacing={2} sx={{ pt: 2 }} {...props}>{props.children}</Grid>
const Cell: FC<PropsWithChildren & GridProps> = (props) => <Grid item {...props}>{props.children}</Grid>

export const EditNewAdvert: FC = () => {
	const [ , , { textField } ] = useFormControls<Advert>({ id: '', title: '', description: '' })

	const layout = [
		[
			() => textField('title', 'Titel',{ required: true }),
		], [
			() => textField('description', 'Beskrivning',{ required: true, multiline: true, minRows: 4 }),
		],
	]

	return (
		<Box component="form">
			{layout.map((row, rowIndex) => (
				<Row key={rowIndex}>
					{row.map((cell, cellIndex) => (
						<Cell key={cellIndex}>{cell()}</Cell>
					))}

				</Row>))}
			<Row justifyContent="flex-end">
				<Cell><Button variant="contained" startIcon={<SaveIcon/>}>Spara annonsen</Button></Cell>
			</Row>
		</Box>)
}