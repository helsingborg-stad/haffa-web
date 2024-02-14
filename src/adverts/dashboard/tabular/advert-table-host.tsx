import { Advert, AdvertFilterInput } from 'adverts'
import { Func1 } from 'lib/types'
import { Markdown } from 'components/Markdown'
import { TableHost } from './types'
import { SortableHeader } from './SortableHeader'
import { ImageCell } from './ImageCell'

export const createAdvertTableHost: Func1<
    {
        filter: AdvertFilterInput
        setFilter: (f: AdvertFilterInput) => void
    },
    TableHost<Advert>
> = ({ filter, setFilter }) => ({
    header: ({ label }) => <span>{label}</span>,
    cell: (advert, { key }) => <span>{advert[key]?.toString() || ''}</span>,
    sortableHeader: ({ key, label }) => (
        <SortableHeader
            field={key}
            label={label}
            filter={filter}
            setFilter={setFilter}
        />
    ),
    image: (advert) => <ImageCell url={advert.images[0]?.url} />,
    markdown: (advert, { key }) => (
        <Markdown markdown={advert[key]?.toString() || ''} />
    ),
})
