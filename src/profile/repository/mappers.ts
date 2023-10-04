import { ProfileInput } from 'profile/types'

export const sanitizeProfileInput = ({
    phone,
    adress,
    zipCode,
    city,
    country,
    organization,
}: ProfileInput): ProfileInput => ({
    phone,
    adress,
    zipCode,
    city,
    country,
    organization,
})
