import { FC } from 'react'
import { renderError } from '.'
import { Layout } from '../../layout'
import { Phrase } from '../../phrases/Phrase'

export const ErrorView: FC<{error: any}> = ({ error }) => {
	console.error({ error })
	return renderError(error, {
		notFound: () => (<Layout><Phrase key='ERROR_NOT_FOUND' value='Ojoj, sidan finns inte'/></Layout>),
		default: () => (<Layout><Phrase key='ERROR_UNKNOWN' value='Ajsing bajsing, något gick sönder :('/></Layout>),
	})
}
