import {
    Card,
    CardContent,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Switch,
    TextField,
} from '@mui/material'
import { FC, useCallback, useState } from 'react'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { objectToOptions, optionsToObject } from 'options/mappers'
import {
    LabelOptions,
    type LabelOptionsKeys,
    type Option,
} from '../../options/types'
import { getDefaultLabelOptions } from './mappers'

export const EditLabelsForm: FC<{
    options: Option<LabelOptionsKeys>[]
    onUpdate: (
        options: Option<LabelOptionsKeys>[]
    ) => Promise<Option<LabelOptionsKeys>[]>
}> = ({ options, onUpdate }) => {
    const [state, setState] = useState<LabelOptions>({
        ...getDefaultLabelOptions(),
        ...optionsToObject(options),
    })
    const patch = useCallback(
        (patch: Partial<LabelOptions>) =>
            setState({
                ...state,
                ...patch,
            }),
        [state, setState]
    )

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_LABELS_TITLE"
                body="ADMIN_LABELS_BODY"
            />
            <AdminActionPanel
                onSave={() => onUpdate(objectToOptions(state))}
                onRestore={() => {
                    setState(getDefaultLabelOptions())
                }}
            />
            <Card>
                <CardContent>
                    <TextField
                        fullWidth
                        sx={{ mt: 2 }}
                        value={state.headline}
                        label="Rubrik"
                        onChange={({ target: { value } }) => {
                            patch({ headline: value })
                        }}
                    />
                    <TextField
                        fullWidth
                        select
                        sx={{ mt: 2 }}
                        value={state.errorCorrectionLevel}
                        label="Felkorrigeringsnivå"
                        onChange={({ target: { value } }) => {
                            patch({ errorCorrectionLevel: value })
                        }}
                    >
                        <MenuItem value="low">Låg</MenuItem>
                        <MenuItem value="medium">Mellan</MenuItem>
                        <MenuItem value="high">Hög</MenuItem>
                        <MenuItem value="quartile">Kvartil</MenuItem>
                    </TextField>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.displayReference === 'true'}
                                    onChange={({ target: { checked } }) =>
                                        patch({
                                            displayReference: checked
                                                ? 'true'
                                                : 'false',
                                        })
                                    }
                                    inputProps={{
                                        'aria-label': 'Visa referensnummer',
                                    }}
                                />
                            }
                            label="Visa referensnummer"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.displayTitle === 'true'}
                                    onChange={({ target: { checked } }) =>
                                        patch({
                                            displayTitle: checked
                                                ? 'true'
                                                : 'false',
                                        })
                                    }
                                    inputProps={{
                                        'aria-label': 'Visa annonstitel',
                                    }}
                                />
                            }
                            label="Visa annonstitel"
                        />
                    </FormGroup>
                </CardContent>
            </Card>
        </>
    )
}
