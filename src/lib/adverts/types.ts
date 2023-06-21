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
	getAdvert: (id: string) => Promise<Advert>
	listAdverts: () => Promise<Advert[]>
	createAdvert: (advert: CreateAdvertInput) => Promise<Advert>
}