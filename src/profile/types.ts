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
    getProfile: () => Promise<Profile>
    updateProfile: (input: ProfileInput) => Promise<Profile>
}
