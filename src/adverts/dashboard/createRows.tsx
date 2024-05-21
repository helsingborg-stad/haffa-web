import { Advert } from 'adverts/types'

export const createRows = (adverts: Advert[]) =>
    adverts.map((advert) => ({
        id: advert.id,
        image: advert.images[0]?.url ?? '',
        title: advert.title,
        category: advert.category,
        tags: advert.tags,
        reference: advert.reference,
        notes: advert.notes,
        lendingPeriod: advert.lendingPeriod,
        isOverdue: advert.meta.claims.some(({ isOverdue }) => isOverdue),
        isPicked: advert.meta.isPicked,
        visitLink: `/advert/${advert.id}`,
        editLink: `/advert/edit/${advert.id}`,
    }))
