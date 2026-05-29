import { Tab, Tabs } from '@mui/material'
import type { FC, PropsWithChildren, ReactNode } from 'react'

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
        label: string
    } & PropsWithChildren
> = ({ index, value, label, children }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${label}`}
        aria-labelledby={`tab-${label}`}
    >
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
                <Tab
                    key={label}
                    label={label}
                    id={`tab-${label}`}
                    aria-controls={`tabpanel-${label}`}
                    aria-selected={value === index}
                />
            ))}
        </Tabs>
        {tabs.map(({ component, label }, index) => (
            <CustomTabPanel
                key={label}
                index={index}
                value={value}
                label={label}
            >
                {component()}
            </CustomTabPanel>
        ))}
    </>
)
