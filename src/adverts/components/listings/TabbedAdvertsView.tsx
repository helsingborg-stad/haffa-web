import { FC } from 'react'
import { Tab, Tabs } from '@mui/material'
import useLocalStorage from 'hooks/use-local-storage'
import { AdvertRestrictionsFilterInput } from 'adverts'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

const CACHE_VERSION = 'v4'

export interface AdvertsTab {
    label: string
    name: string
    restrictions: AdvertRestrictionsFilterInput
}

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
    cacheName: string
    index: number
    value: number
    restrictions: AdvertRestrictionsFilterInput
}> = ({ index, value, cacheName, restrictions }) => (
    <CustomTabPanel index={index} value={value}>
        <AdvertsListWithSearch
            cacheName={cacheName}
            defaultSearchParams={{
                restrictions,
                sorting: { field: 'createdAt', ascending: false },
            }}
        />
    </CustomTabPanel>
)

export const TabbedAdvertsView: FC<{
    baseCacheName: string
    tabs: AdvertsTab[]
}> = ({ baseCacheName, tabs }) => {
    const [tabIndex, setTabIndex] = useLocalStorage(
        `${baseCacheName}-tab-${CACHE_VERSION}`,
        0
    )
    return (
        <>
            <Tabs
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                value={tabIndex}
                onChange={(_, newTabIndex) => setTabIndex(newTabIndex)}
            >
                {tabs.map(({ label }) => (
                    <Tab label={label} />
                ))}
            </Tabs>
            {tabs.map(({ name, restrictions }, index) => (
                <SearchTabPanel
                    cacheName={`${baseCacheName}-${name}-${CACHE_VERSION}`}
                    index={index}
                    value={tabIndex}
                    restrictions={restrictions}
                />
            ))}
        </>
    )
}
