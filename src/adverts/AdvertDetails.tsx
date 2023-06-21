import { FC } from 'react'
import { Advert } from '../lib/adverts/types'
import { CardActionArea, CardContent, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export const AdvertDetails: FC<{advert: Advert}> = ({ advert }) => (
	<CardActionArea component={Link} to={`/advert/${advert.id}`}>
		<CardContent>
			<Typography variant="h5" component="div">
				{advert.title}
			</Typography>
			<Typography component="p">
				{advert.description}
			</Typography>
		</CardContent>
	</CardActionArea>
)
