import { Tab, Tabs } from '@mui/material'
import { FC, PropsWithChildren, useContext, useMemo } from 'react'
import { PhraseContext } from 'phrases'
import { AuthContext } from 'auth'
import { useUrlParams } from 'url-params'
import { createAdminTabs } from './admin-tabs'

const CustomTabPanel: FC<
    {
        index: number
        value: number
    } & PropsWithChildren
> = ({ index, value, children }) => (
    <div
        key={`tab-panel-${index}`}
        role="tabpanel"
        hidden={value !== index}
        id={`tab-panel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
    >
        {value === index && children}
    </div>
)

export const AdminView: FC = () => {
    const { roles } = useContext(AuthContext)
    const { phrase } = useContext(PhraseContext)

    const [tabIndex, setTabIndex] = useUrlParams(
        '',
        (p) => parseInt(p.tab, 10) || 0,
        (tabIndex) => ({ tab: tabIndex })
    )
    const tabs = useMemo(() => createAdminTabs(roles, phrase), [roles, phrase])

    return (
        <>
            <Tabs
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                value={tabIndex}
                onChange={(_, newTabIndex) => setTabIndex(newTabIndex)}
            >
                {tabs.map(({ label }, index) => (
                    <Tab key={index} label={label} />
                ))}
            </Tabs>
            {tabs.map(({ component }, index) => (
                <CustomTabPanel key={index} index={index} value={tabIndex}>
                    {component}
                </CustomTabPanel>
            ))}
        </>
    )
}
