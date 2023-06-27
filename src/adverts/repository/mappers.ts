import { Advert, CreateAdvertInput } from '../../adverts/types'

export const createEmptyCreateAdvertInput = (): CreateAdvertInput => ({
	title: '', 
	description: '', 
	unit: '',
	material: '',
	condition: '',
	usage: '',
})

// eslint-disable-next-line no-undef
export const mapAdvertToCreateAdvertInput = ({ title, description }: Advert|CreateAdvertInput): CreateAdvertInput => ({ 
	title, 
	description, 
	unit: '',
	material: '',
	condition: '',
	usage: '',
})