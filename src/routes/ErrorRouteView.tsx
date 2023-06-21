import { FC } from 'react'
import { ErrorView } from '../lib/errors'
import { Layout } from '../screens/layout'
import { useRouteError } from 'react-router-dom'

export const ErrorRouteView: FC = () => {
	const error = useRouteError()
	return <Layout><ErrorView error={error} /></Layout>
}
