import { Tab, Tabs } from '@mui/material'
import { FC, PropsWithChildren, ReactNode } from 'react'

export interface SimpleTab {
    label: string
    component: () => ReactNode
}

export const makeSimpleTab = (
    enabled: boolean | undefined,
    label: string,
    component: () => ReactNode
): SimpleTab | null =>
    enabled
        ? {
              label,
              component,
          }
        : null

const CustomTabPanel: FC<
    {
        index: number
        value: number
    } & PropsWithChildren
> = ({ index, value, children }) => (
    <div key={`tab-panel-${index}`} role="tabpanel" hidden={value !== index}>
        {value === index && children}
    </div>
)

export const SimpleTabs: FC<{
    tabs: SimpleTab[]
    value: number
    onChange: (index: number) => any
}> = ({ tabs, value, onChange }) => (
    <>
        <Tabs
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            value={value}
            onChange={(_, newTabIndex) => onChange(newTabIndex)}
            sx={{ pb: 2 }}
        >
            {tabs.map(({ label }, index) => (
                <Tab key={index} label={label} />
            ))}
        </Tabs>
        {tabs.map(({ component }, index) => (
            <CustomTabPanel key={index} index={index} value={value}>
                {component()}
            </CustomTabPanel>
        ))}
    </>
)
