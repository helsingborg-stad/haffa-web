import { FC, PropsWithChildren, createContext } from 'react'
import { LoginPoliciesRepository } from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`LoginPoliciesContext::${name} is not implemented`)
}

export const LoginPoliciesContext = createContext<LoginPoliciesRepository>({
    getLoginPolicies: notImplemented('getLoginPolicies'),
    updateLoginPolicies: notImplemented('updateLoginPolicies'),
})

export const LoginPoliciesProvider: FC<
    PropsWithChildren<{ repository: LoginPoliciesRepository }>
> = ({ repository, children }) => (
    <LoginPoliciesContext.Provider value={repository}>
        {children}
    </LoginPoliciesContext.Provider>
)
