import { FC, PropsWithChildren, useState } from 'react'
import { Tab, Tabs } from '@mui/material'
import { EditThemePanel } from './theme/EditThemePanel'
import { EditPhrasesPanel } from './phrases/EditPhrasesPanel'

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

export const EditBrandingView: FC = () => {
    const [tabIndex, setTabIndex] = useState(0)
    return (
        <>
            <Tabs
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                value={tabIndex}
                onChange={(_, newTabIndex) => setTabIndex(newTabIndex)}
            >
                <Tab key="theme" label="Tema" />
                <Tab key="phrases" label="Texter och fraser" />
            </Tabs>

            <CustomTabPanel key="theme-panel" index={0} value={tabIndex}>
                <EditThemePanel />
            </CustomTabPanel>
            <CustomTabPanel key="phrases-panel" index={1} value={tabIndex}>
                <EditPhrasesPanel />
            </CustomTabPanel>
        </>
    )
}
