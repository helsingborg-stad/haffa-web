import { FC } from 'react'
import { Layout } from '../../layout'
import { AuthenticatePanel } from './AuthenticatePanel'

export const AuthenticateView: FC = () => (
    <Layout hideNavigation>
        <AuthenticatePanel onAuthenticated={() => {}} />
    </Layout>
)
