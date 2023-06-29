import { FC } from 'react'
import { useRouteError } from 'react-router-dom'
import { ErrorView } from '../errors'
import { Layout } from '../layout'

export const ErrorRouteView: FC = () => {
    const error = useRouteError()
    return (
        <Layout>
            <ErrorView error={error} />
        </Layout>
    )
}
