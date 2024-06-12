import { createContext } from 'react'
import { DeepLinkService } from './types'

const getAdvertLink: DeepLinkService['getAdvertLink'] = ({ id }) => {
    const url = new URL(`/advert/${id}`, window.location.href)
    return url.toString()
}

const getAdvertLinkForQrCode: DeepLinkService['getAdvertLinkForQrCode'] = ({
    id,
}) => {
    const url = new URL(`/advert/${id}`, window.location.href)
    url.searchParams.append('intent', 'advert')
    url.searchParams.append('s', btoa(id))
    return url.toString()
}

const isCurrentLinkFromQrCode: DeepLinkService['isCurrentLinkFromQrCode'] = (
    advert
) => window.location.href === getAdvertLinkForQrCode(advert)

const actOnLink: DeepLinkService['actOnLink'] = (url, actions) => {
    try {
        if (!url) {
            return actions.none()
        }
        const { protocol, hostname, port } = window.location
        const parsed = new URL(url)
        if (
            protocol === parsed.protocol &&
            hostname === parsed.hostname &&
            port === parsed.port
        ) {
            return actions.sameDomain(parsed)
        }
        return actions.otherDomain(parsed)
    } catch (e) {
        return actions.error(e)
    }
}

export const DeepLinkContext = createContext<DeepLinkService>({
    getAdvertLink,
    getAdvertLinkForQrCode,
    isCurrentLinkFromQrCode,
    actOnLink,
})
