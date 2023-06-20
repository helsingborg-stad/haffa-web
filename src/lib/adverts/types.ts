export interface CreateAdvertInput {
	title: string
	description: string
}

export interface Advert {
	id: string
	title: string
	description: string
}

export interface AdvertsRepository {
	listAdverts: () => Promise<Advert[]>
	createAdvert: (advert: CreateAdvertInput) => Promise<Advert>
}