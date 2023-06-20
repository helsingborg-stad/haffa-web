import { AdvertsRepository } from './types'

export const createAdvertsRepository = (): AdvertsRepository => ({
	listAdverts: async () => ([]),
	createAdvert: async (advert) => ({
		...advert,
		id: '123',
	}),
})