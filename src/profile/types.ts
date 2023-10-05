export interface ProfileUserFields {
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
    phone: string
    adress: string
    zipCode: string
    city: string
    country: string
    organization: string
}

export interface ProfileRepository {
    getProfile: (init?: Pick<RequestInit, 'signal'>) => Promise<Profile>
    updateProfile: (
        input: ProfileInput,
        init?: Pick<RequestInit, 'signal'>
    ) => Promise<Profile>
}
