import { FC } from 'react'
import { Tab, Tabs } from '@mui/material'
import { AdvertRestrictionsFilterInput } from 'adverts'
import { useUrlParams } from 'url-params'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

export interface AdvertsTab {
    label: string
    name: string
    restrictions: AdvertRestrictionsFilterInput
    hideFilter: boolean
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
    prefix: string
    index: number
    value: number
    restrictions: AdvertRestrictionsFilterInput
    hideFilter: boolean
    scrollTopOnFilterChange?: boolean
}> = ({
    index,
    value,
    prefix,
    restrictions,
    hideFilter,
    scrollTopOnFilterChange,
}) => (
    <CustomTabPanel index={index} value={value}>
        <AdvertsListWithSearch
            prefix={prefix}
            hideFilter={hideFilter}
            scrollTopOnFilterChange={scrollTopOnFilterChange}
            defaultSearchParams={{
                restrictions,
                sorting: { field: 'createdAt', ascending: false },
            }}
        />
    </CustomTabPanel>
)

export const TabbedAdvertsView: FC<{
    tabs: AdvertsTab[]
    scrollTopOnFilterChange?: boolean
}> = ({ tabs, scrollTopOnFilterChange }) => {
    const [tabIndex, setTabIndex] = useUrlParams(
        '',
        (p) => parseInt(p.tab, 10) || 0,
        (tabIndex) => ({ tab: tabIndex })
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
                {tabs.map(({ name, label }) => (
                    <Tab key={name} label={label} />
                ))}
            </Tabs>
            {tabs.map(({ name, restrictions, hideFilter }, index) => (
                <SearchTabPanel
                    key={name}
                    prefix={index.toString()}
                    index={index}
                    value={tabIndex}
                    restrictions={restrictions}
                    hideFilter={hideFilter}
                    scrollTopOnFilterChange={scrollTopOnFilterChange}
                />
            ))}
        </>
    )
}
