import { FC, useContext } from 'react'
import { AdvertsContext } from '../AdvertsContext'
import useAsync from '../../hooks/use-async'
import { AdvertsList } from './AdvertsList'
import { ErrorView } from '../../errors'

export const AdvertsView: FC = () => {
	const { listAdverts } = useContext(AdvertsContext)
	const view = useAsync(() => listAdverts())
	return view({
		pending: () => <span>laddar</span>,
		rejected: (error) => (<ErrorView error={error}/>),
		resolved: (adverts) => <AdvertsList adverts={adverts}/>,
	})
}