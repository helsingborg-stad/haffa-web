import { createContext } from "react";
import { DeepLinkService } from "./types";

const getAdvertLinkForQrCode: DeepLinkService['getAdvertLinkForQrCode'] = ({id}) => {
	const url = new URL(`/advert/${id}`, window.location.href)
	url.searchParams.append('intent', 'advert')
	url.searchParams.append('s',btoa(id))
	return url.toString()
}

const isCurrentLinkFromQrCode: DeepLinkService['isCurrentLinkFromQrCode'] = (advert) => window.location.href === getAdvertLinkForQrCode(advert)

export const DeepLinkContext = createContext<DeepLinkService>({
	getAdvertLinkForQrCode,
	isCurrentLinkFromQrCode
})