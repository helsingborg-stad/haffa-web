import { FC } from 'react'
import { renderError } from '.'
import { Layout } from '../../screens/layout'

export const ErrorView: FC<{error: any}> = ({ error }) => {
	console.error({ error })
	return renderError(error, {
		notFound: () => (<Layout><span>Ojoj, sidan finns inte</span></Layout>),
		default: () => (<Layout><span>Ajsing bajsing, något är lite sönder</span></Layout>),
	})
}
