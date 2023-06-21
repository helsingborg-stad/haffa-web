import { FC } from 'react'
import { Advert } from '../lib/adverts/types'
import { AdvertDetails } from './AdvertDetails'

export const AdvertsList: FC<{adverts: Advert[]}> = ({ adverts }) => (
	<>
		{adverts.map(advert => <AdvertDetails key={advert.id} advert={advert} />)}
	</>
)