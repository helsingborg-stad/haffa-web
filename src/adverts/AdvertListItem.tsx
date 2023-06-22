import { FC } from 'react'
import { Advert } from '../lib/adverts/types'
import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export const AdvertListItem: FC<{advert: Advert}> = ({ advert }) => (
	<Card sx={{ mb: 2 }}>
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
	</Card>
)
