import { Advert } from 'adverts'

export interface LinkActions<T = any> {
    none: () => T
    sameDomain: (url: URL) => T
    otherDomain: (url: URL) => T
    error: (e: Error | any) => T
}
export interface DeepLinkService {
    getAdvertLinkForQrCode: (advert: Advert) => string
    isCurrentLinkFromQrCode: (advert: Advert) => boolean
    actOnLink: <T = any>(link: string | undefined, actions: LinkActions<T>) => T
}
