import { ProfileInput } from 'profile/types'

export const sanitizeProfileInput = ({
    name,
    phone,
    adress,
    zipCode,
    city,
    country,
    organization,
}: ProfileInput): ProfileInput => ({
    name,
    phone,
    adress,
    zipCode,
    city,
    country,
    organization,
})
