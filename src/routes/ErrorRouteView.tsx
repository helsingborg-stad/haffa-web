import { FC } from 'react'
import { ErrorView } from '../errors'
import { Layout } from '../layout'
import { useRouteError } from 'react-router-dom'

export const ErrorRouteView: FC = () => {
	const error = useRouteError()
	return <Layout><ErrorView error={error} /></Layout>
}
