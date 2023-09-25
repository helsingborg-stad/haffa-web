import { FC, useContext } from 'react'
import { Tab, Tabs } from '@mui/material'
import { PhraseContext } from 'phrases/PhraseContext'
import useLocalStorage from 'hooks/use-local-storage'
import { AdvertRestrictionsFilterInput } from 'adverts'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            key={`tab-panel-${index}`}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    )
}

const SearchTabPanel: FC<{
    name: string
    index: number
    value: number
    restrictions: AdvertRestrictionsFilterInput
}> = ({ index, value, name, restrictions }) => (
    <CustomTabPanel index={index} value={value}>
        <AdvertsListWithSearch
            cacheName={`my-adverts-${name}-v2`}
            defaultSearchParams={{
                restrictions,
                sorting: { field: 'createdAt', ascending: false },
            }}
        />
    </CustomTabPanel>
)

export const MyAdvertsView: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const [tabIndex, setTabIndex] = useLocalStorage('my-adverts-tab-v1', 0)
    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={(_, newTabIndex) => setTabIndex(newTabIndex)}
            >
                <Tab label={phrase('', 'Aktiva')} />
                <Tab label={phrase('', 'Reserverade')} />
                <Tab label={phrase('', 'Arkiverade')} />
                <Tab label={phrase('', 'Uthämtade')} />
            </Tabs>
            <SearchTabPanel
                name="active"
                index={0}
                value={tabIndex}
                restrictions={{ createdByMe: true, canBeReserved: true }}
            />
            <SearchTabPanel
                name="reserved"
                index={1}
                value={tabIndex}
                restrictions={{ createdByMe: true, hasReservations: true }}
            />
            <SearchTabPanel
                name="archived"
                index={2}
                value={tabIndex}
                restrictions={{ createdByMe: true, isArchived: true }}
            />
            <SearchTabPanel
                name="collected"
                index={3}
                value={tabIndex}
                restrictions={{ createdByMe: true, hasCollects: true }}
            />
        </>
    )
}
