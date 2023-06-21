import { FC } from 'react'
import { useRouteError } from 'react-router-dom'
import { renderError } from './lib/errors'

export const RouteError: FC = () => {
	const error = useRouteError() as Error

	return renderError(error, {
		notFound: () => (<span>Ojoj, sidan finns inte</span>),
		default: () => (<span>Ajsing bajsing, något är lite sönder</span>),
	})
}
