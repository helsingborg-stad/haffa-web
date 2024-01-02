import { OperationResult } from 'graphql'

export interface ProfileUserFields {
    name: string
    phone: string
    adress: string
    zipCode: string
    city: string
    country: string
    organization: string
}
export interface Profile extends ProfileUserFields {
    email: string
}

export interface ProfileInput {
    name: string
    phone: string
    adress: string
    zipCode: string
    city: string
    country: string
    organization: string
}

export interface RemoveProfileInput {
    removeAdverts: boolean
}

export interface ProfileRepository {
    getProfile: (init?: Pick<RequestInit, 'signal'>) => Promise<Profile>
    updateProfile: (
        input: ProfileInput,
        init?: Pick<RequestInit, 'signal'>
    ) => Promise<Profile>
    removeProfile: (
        input: RemoveProfileInput,
        init?: Pick<RequestInit, 'signal'>
    ) => Promise<OperationResult>
}
