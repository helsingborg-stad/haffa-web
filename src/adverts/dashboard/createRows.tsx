import { Advert } from 'adverts/types'
import { uniqueBy } from 'lib/unique-by'
import { AdvertTableRow } from './AdvertsTable/types'

export const createRows = (
    adverts: Advert[],
    density: string
): AdvertTableRow[] =>
    adverts.map((advert) => ({
        id: advert.id,
        image: [advert.images[0]?.url, `/advert/${advert.id}`, density],
        title: advert.title,
        category: advert.category,
        tags: advert.tags,
        reference: advert.reference,
        notes: advert.notes,
        reservedAt: advert.reservedAt.split('T')[0],
        collectedAt: advert.collectedAt.split('T')[0],
        returnedAt: advert.returnedAt.split('T')[0],
        place: advert.place,
        trackingName: advert.meta.claims
            .map(({ pickupLocation }) => pickupLocation?.trackingName)
            .filter((x) => x)
            .filter(uniqueBy((x) => x))
            .join(','),

        lendingPeriod: advert.lendingPeriod,
        expectedReturnDate: (advert.meta.returnInfo[0]?.at || '').split('T')[0],
        isOverdue: advert.meta.claims.some(({ isOverdue }) => isOverdue),
        isPicked: advert.meta.isPicked,
        visitLink: `/advert/${advert.id}`,
        editLink: `/advert/edit/${advert.id}`,
    }))
