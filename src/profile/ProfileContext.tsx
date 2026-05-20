import { createContext, type FC, type PropsWithChildren } from 'react'
import type { ProfileRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`ProfileContext::${method} is not provided`)
}

export const ProfileContext = createContext<ProfileRepository>({
    getProfile: notProvided('getProfile'),
    updateProfile: notProvided('updateProfile'),
    removeProfile: notProvided('removeProfile'),
})

export const ProfileProvider: FC<
    PropsWithChildren<{ repository: ProfileRepository }>
> = ({ repository, children }) => (
    <ProfileContext.Provider value={repository}>
        {children}
    </ProfileContext.Provider>
)
