import { FC, useContext } from 'react'
import { Advert } from '../types'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import { PhraseContext } from '../../phrases/PhraseContext'

export const AdvertDetails: FC<{advert: Advert}> = ({ advert }) => {
	const { EDIT_ADVERT } = useContext(PhraseContext)
	const { permissions } = advert
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" component="div">
					{advert.title}
				</Typography>
				<Typography component="p">
					{advert.description}
				</Typography>
			</CardContent>
			<CardActions>
				{permissions.edit 
				&& <Button color='primary' component={NavLink} to={`/edit-advert/${advert.id}`}><EditIcon/>
					{EDIT_ADVERT}
				</Button>}
				

			</CardActions>
		</Card>
	)
}