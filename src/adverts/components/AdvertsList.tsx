import { FC } from 'react'
import { Advert } from '../types'
import { AdvertListItem } from './AdvertListItem'

export const AdvertsList: FC<{adverts: Advert[]}> = ({ adverts }) => (
	<>
		{adverts.map(advert => <AdvertListItem key={advert.id} advert={advert} />)}
	</>
)