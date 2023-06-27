export interface IdFilterInput {
	ne?: string
	eq?: string
}
export interface StringFilterInput {
	ne?: string
	eq?: string
	gt?: string
	gte?: string
	lt?: string
	lte?: string
	contains?: string
} 
export interface FilterAdvertsInput {
	id?: IdFilterInput
	title?: StringFilterInput
	description?: StringFilterInput
}

export interface AdvertImage {
	url: string
}

export interface AdvertInput {
	title: string
	description: string
	images: AdvertImage[]
	/* terms */
	unit: string
	material: string
	condition: string
	usage: string
}

export interface AdvertsSearchParams {
	search: string
}

export interface AdvertPermissions {
	edit: boolean
	delete: boolean
	book: boolean
	claim: boolean
}

export interface Advert {
	permissions: AdvertPermissions
	id: string
	title: string
	description: string
	images: AdvertImage[]

	unit: string
	material: string
	condition: string
	usage: string
}

export interface AdvertTerms {
	unit: string[],
	material: string[],
	condition: string[],
	usage: string[],
}
export interface AdvertsRepository {
	getTerms: () => Promise<AdvertTerms>
	getAdvert: (id: string) => Promise<Advert>
	listAdverts: (searchParams?: AdvertsSearchParams) => Promise<Advert[]>
	createAdvert: (input: AdvertInput) => Promise<Advert>
	updateAdvert: (id: string, input: AdvertInput) => Promise<Advert>
}