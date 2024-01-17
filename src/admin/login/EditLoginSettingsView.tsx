import { FC, useContext, useMemo } from 'react'
import { useUrlParams } from 'url-params'
import { SimpleTabs, makeSimpleTab } from 'components/SimpleTabs'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { PhraseContext } from 'phrases'
import { EditLoginPoliciesView } from './login-policies'
import { EditPublicAccessView } from './public-access'

export const EditLoginSettingsView: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const [tabIndex, setTabIndex] = useUrlParams(
        '',
        (p) => parseInt(p.ls, 10) || 0,
        (tabIndex) => ({ ls: tabIndex })
    )
    const tabs = useMemo(
        () =>
            [
                makeSimpleTab(
                    true,
                    phrase('LOGINS_FIELD_PERMISSIONS', 'Email & behörigheter'),
                    <EditLoginPoliciesView />
                ),
                makeSimpleTab(
                    true,
                    phrase('PUBLIC_ACCESS_TITLE', 'Publik åtkomst'),
                    <EditPublicAccessView />
                ),
            ]
                .filter((v) => v)
                .map((v) => v!),
        [phrase]
    )

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_LOGINS_HEADLINE"
                body="ADMIN_LOGINS_BODY"
            />

            <SimpleTabs tabs={tabs} value={tabIndex} onChange={setTabIndex} />
        </>
    )
}
