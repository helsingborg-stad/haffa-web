import { FC } from 'react'
import { Advert } from '../types'
import { Card, CardContent, Typography } from '@mui/material'

export const AdvertDetails: FC<{advert: Advert}> = ({ advert }) => (
	<Card>
		<CardContent>
			<Typography variant="h5" component="div">
				{advert.title}
			</Typography>
			<Typography component="p">
				{advert.description}
			</Typography>
		</CardContent>
	</Card>
)
