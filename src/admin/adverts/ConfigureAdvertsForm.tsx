import { FC, useContext, useState } from 'react'
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

import { PhraseContext } from 'phrases'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { createEmptyConfiguration } from 'advert-field-config/repository/mappers'

const getLabel = (key: string): string =>
    ({
        title: 'ADVERT_FIELD_TITLE',
        description: 'ADVERT_FIELD_DESCRIPTION',
        unit: 'ADVERT_FIELD_UNIT',
        quantity: 'ADVERT_FIELD_QUANTITY',
        width: 'ADVERT_FIELD_WIDTH',
        height: 'ADVERT_FIELD_HEIGHT',
        depth: 'ADVERT_FIELD_DEPTH',
        weight: 'ADVERT_FIELD_WEIGHT',
        size: 'ADVERT_FIELD_SIZE',
        material: 'ADVERT_FIELD_MATERIAL',
        condition: 'ADVERT_FIELD_CONDITION',
        usage: 'ADVERT_FIELD_USAGE',
        category: 'ADVERT_FIELD_CATEGORY',
        reference: 'ADVERT_FIELD_REFERENCE',
        organization: 'ADVERT_FIELD_ORGANIZATION',
        tags: 'ADVERT_FIELD_TAGS',
        name: 'ADVERT_FIELD_LOCATION_NAME',
        adress: 'ADVERT_FIELD_LOCATION_ADRESS',
        zipCode: 'ADVERT_FIELD_LOCATION_ZIPCODE',
        city: 'ADVERT_FIELD_LOCATION_CITY',
        email: 'ADVERT_FIELD_CONTACT_EMAIL',
        phone: 'ADVERT_FIELD_CONTACT_PHONE',
    }[key] ?? key)

export const ConfigureAdvertsForm: FC<{
    config: AdvertFieldConfig
    update: (data: AdvertFieldConfig) => Promise<AdvertFieldConfig>
}> = ({ config, update }) => {
    const { phrase } = useContext(PhraseContext)

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
                            <TableCell>Fält</TableCell>
                            <TableCell>Synligt</TableCell>
                            <TableCell>Obligatoriskt</TableCell>
                            <TableCell>Standardvärde</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.map((f, key) => (
                            <TableRow key={key}>
                                <TableCell>
                                    {phrase(getLabel(f.name), '')}
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
