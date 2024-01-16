import { FC, useState } from 'react'
import {
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'

import { AdvertFieldConfig } from 'advert-field-config/types'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { createEmptyConfiguration } from 'advert-field-config/repository/mappers'

export const ConfigureAdvertsForm: FC<{
    config: AdvertFieldConfig
    update: (data: AdvertFieldConfig) => Promise<AdvertFieldConfig>
}> = ({ config, update }) => {
    const [state, setState] = useState<AdvertFieldConfig>(config)

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_ADVERTS_HEADLINE"
                body="ADMIN_ADVERTS_BODY"
            />
            <AdminActionPanel
                onSave={() => update(state)}
                onRestore={() => setState(createEmptyConfiguration())}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Benämning</TableCell>
                            <TableCell>Synligt</TableCell>
                            <TableCell>Obligatoriskt</TableCell>
                            <TableCell>Standardvärde</TableCell>
                            <TableCell>Utsmyckning</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.map((f, key) => (
                            <TableRow key={key}>
                                <TableCell>
                                    <TextField
                                        value={f.label}
                                        onChange={(e) =>
                                            setState([
                                                ...state.slice(0, key),
                                                ...[
                                                    {
                                                        ...f,
                                                        label: e.target.value,
                                                    },
                                                ],
                                                ...state.slice(key + 1),
                                            ])
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={f.visible}
                                        onChange={(e) =>
                                            setState([
                                                ...state.slice(0, key),
                                                ...[
                                                    {
                                                        ...f,
                                                        mandatory: e.target
                                                            .checked
                                                            ? f.mandatory
                                                            : false,
                                                        visible:
                                                            e.target.checked,
                                                    },
                                                ],
                                                ...state.slice(key + 1),
                                            ])
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={f.mandatory && f.visible}
                                        disabled={!f.visible}
                                        onChange={(e) =>
                                            setState([
                                                ...state.slice(0, key),
                                                ...[
                                                    {
                                                        ...f,
                                                        mandatory:
                                                            e.target.checked,
                                                    },
                                                ],
                                                ...state.slice(key + 1),
                                            ])
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={f.initial}
                                        onChange={(e) =>
                                            setState([
                                                ...state.slice(0, key),
                                                ...[
                                                    {
                                                        ...f,
                                                        initial: e.target.value,
                                                    },
                                                ],
                                                ...state.slice(key + 1),
                                            ])
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={f.adornment}
                                        onChange={(e) =>
                                            setState([
                                                ...state.slice(0, key),
                                                ...[
                                                    {
                                                        ...f,
                                                        adornment:
                                                            e.target.value,
                                                    },
                                                ],
                                                ...state.slice(key + 1),
                                            ])
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AdminActionPanel
                onSave={() => update(state)}
                onRestore={() => setState(createEmptyConfiguration())}
            />
        </>
    )
}
