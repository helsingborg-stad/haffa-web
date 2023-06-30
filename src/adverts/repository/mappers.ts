import { AdvertInput } from '../types'

const toInt = (v: any): number => parseInt(v, 10)

export const createEmptyCreateAdvertInput = (): AdvertInput => ({
    title: '',
    description: '',
    quantity: 1,
    images: [],
    unit: '',
    material: '',
    condition: '',
    usage: '',
})

// eslint-disable-next-line no-undef
export const sanitizeAdvertInput = ({
    title,
    description,
    images,
    quantity,
    unit,
    material,
    condition,
    usage,
}: AdvertInput): AdvertInput => ({
    title,
    description,
    quantity: toInt(quantity),
    images,
    unit,
    material,
    condition,
    usage,
})
