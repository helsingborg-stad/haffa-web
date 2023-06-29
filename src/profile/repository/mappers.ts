import { ProfileInput } from 'profile/types'

export const sanitizeProfileInput = ({
    phone,
    adress,
    zipCode,
    city,
    country,
}: ProfileInput): ProfileInput => ({ phone, adress, zipCode, city, country })
