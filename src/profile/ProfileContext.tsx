import { FC, PropsWithChildren, createContext } from 'react'
import { ProfileRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`ProfileContext::${method} is not provided`)
}

export const ProfileContext = createContext<ProfileRepository>({
    getProfile: notProvided('getProfile'),
    updateProfile: notProvided('updateProfile'),
})

export const ProfileProvider: FC<
    PropsWithChildren<{ repository: ProfileRepository }>
> = ({ repository, children }) => (
    <ProfileContext.Provider value={repository}>
        {children}
    </ProfileContext.Provider>
)
