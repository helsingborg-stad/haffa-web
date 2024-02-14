import { Advert } from 'adverts'
import { Column, TableHost } from './types'

export const createAdvertTableColumns = (
    host: TableHost<Advert>
): Column<Advert>[] => {
    // const col = (c: Column<Advert>): Column<Advert> => c

    const sortable = (c: Column<Advert>): Column<Advert> => ({
        ...c,
        headerComponent: () => host.sortableHeader(c),
    })
    const image = (c: Column<Advert>): Column<Advert> => ({
        ...c,
        cellComponent: (advert) => host.image(advert, c),
    })
    const markdown = (c: Column<Advert>): Column<Advert> => ({
        ...c,
        cellComponent: (advert) => host.markdown(advert, c),
    })

    return [
        sortable({
            key: 'title',
            label: 'Titel',
        }),
        image({
            key: 'images',
            label: 'Bild',
        }),
        sortable({
            key: 'reference',
            label: 'Egen referens',
        }),
        sortable(
            markdown({
                key: 'description',
                label: 'Beskrivning',
            })
        ),
        sortable({
            key: 'notes',
            label: 'Egna noteringar',
        }),
    ].map((c) => ({
        headerComponent: () => host.header(c),
        cellComponent: (advert) => host.cell(advert, c),
        ...c,
    }))
}
