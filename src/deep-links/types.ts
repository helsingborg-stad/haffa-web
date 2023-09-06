import { Advert } from "adverts"

export interface DeepLinkService {
	getAdvertLinkForQrCode: (advert: Advert) => string
	isCurrentLinkFromQrCode: (advert: Advert) => boolean
}