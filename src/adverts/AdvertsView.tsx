import { FC, useContext } from 'react'
import { AdvertsContext } from '../lib/adverts/AdvertsContext'
import useAsync from '../hooks/use-async'

export const AdvertsView: FC = () => {
	const { listAdverts } = useContext(AdvertsContext)

	const view = useAsync(() => listAdverts())

	return view({
		pending: () => <span>laddar</span>,
		rejected: () => <span>fel</span>,
		resolved: (adverts) => <pre><code>{JSON.stringify(adverts, null, 2)}</code></pre>,
	})
}