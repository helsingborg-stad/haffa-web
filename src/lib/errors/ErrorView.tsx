import { FC, useContext } from 'react'
import { renderError } from '.'
import { Layout } from '../../layout'
import { PhraseContext } from '../../phrases/PhraseContext'

export const ErrorView: FC<{error: any}> = ({ error }) => {
	const { ERROR_NOT_FOUND, ERROR_UNKNOWN } = useContext(PhraseContext)
	console.error({ error })
	return renderError(error, {
		notFound: () => (<Layout>{ERROR_NOT_FOUND}</Layout>),
		default: () => (<Layout>{ERROR_UNKNOWN}</Layout>),
	})
}
