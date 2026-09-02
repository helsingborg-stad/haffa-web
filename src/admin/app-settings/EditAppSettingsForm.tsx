import { Card, CardContent, Checkbox, FormControlLabel } from '@mui/material'
import { defaultAppSettings } from 'app-settings/AppSettingsContext'
import { mapOptionsToAppSettings } from 'app-settings/mappers'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { type FC, useContext, useState } from 'react'
import type { AppSettingsOptionKeys, Option } from '../../options/types'

export const EditAppSettingsForm: FC<{
    options: Option<AppSettingsOptionKeys>[]
    onUpdate: (
        options: Option<AppSettingsOptionKeys>[]
    ) => Promise<Option<AppSettingsOptionKeys>[]>
}> = ({ options, onUpdate }) => {
    const [model, setModel] = useState(mapOptionsToAppSettings(options))

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_APP_SETTINGS_HEADLINE"
                body="ADMIN_APP_SETTINGS_BODY"
            />
            <AdminActionPanel
                onSave={() =>
                    onUpdate([
                        {
                            key: 'warnOnReservingOwnAdvert',
                            value: String(model.warnOnReservingOwnAdvert),
                        },
                    ])
                }
                onRestore={() => {
                    setModel(defaultAppSettings)
                }}
            />
            <Card>
                <CardContent>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={model.warnOnReservingOwnAdvert}
                                onChange={({ target: { checked } }) =>
                                    setModel((prev) => ({
                                        ...prev,
                                        warnOnReservingOwnAdvert: checked,
                                    }))
                                }
                            />
                        }
                        label="Varna vid reservation av egen annons"
                    />
                </CardContent>
            </Card>
        </>
    )
}
