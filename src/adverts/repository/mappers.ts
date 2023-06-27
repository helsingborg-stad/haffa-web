import { AdvertInput } from '../../adverts/types'

export const createEmptyCreateAdvertInput = (): AdvertInput => ({
	title: '', 
	description: '', 
	images: [],
	unit: '',
	material: '',
	condition: '',
	usage: '',
})

// eslint-disable-next-line no-undef
export const sanitizeAdvertInput = ({ title, description, images, unit, material, condition, usage }: AdvertInput): AdvertInput => ({ 
	title, 
	description, 
	images,
	unit,
	material,
	condition,
	usage,
})