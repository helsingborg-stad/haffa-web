export interface Profile {
    email: string
    phone: string
    adress: string
    zipCode: string
    city: string
    country: string
}

export interface ProfileInput {
    phone: string
    adress: string
    zipCode: string
    city: string
    country: string
}

export interface ProfileRepository {
    getProfile: () => Promise<Profile>
    updateProfile: (input: ProfileInput) => Promise<Profile>
}
