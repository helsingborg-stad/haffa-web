import { Card, CardContent, Grid, TextField } from '@mui/material'
import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'
import { Terms } from 'terms/types'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'

export const EditTermsForm: FC<{
    terms: Terms
    onUpdate: (terms: Terms) => void
}> = ({ terms, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const [organization, setOrganization] = useState(
        terms.organization.join('\n')
    )
    const [unit, setUnit] = useState(terms.unit.join('\n'))
    const [material, setMaterial] = useState(terms.material.join('\n'))
    const [condition, setCondition] = useState(terms.condition.join('\n'))
    const [usage, setUsage] = useState(terms.usage.join('\n'))
    const [tags, setTags] = useState(terms.tags.join('\n'))

    interface TermBinding {
        label: string
        value: string
        setValue: typeof setOrganization
    }

    const bindings: TermBinding[] = [
        {
            label: phrase('TERMS_FIELD_ORGANIZATION', 'Organisationer'),
            value: organization,
            setValue: setOrganization,
        },
        {
            label: phrase('TERMS_FIELD_UNIT', 'Enheter'),
            value: unit,
            setValue: setUnit,
        },
        {
            label: phrase('TERMS_FIELD_MATERIAL', 'Material'),
            value: material,
            setValue: setMaterial,
        },
        {
            label: phrase('TERMS_FIELD_CONDITION', 'Skick'),
            value: condition,
            setValue: setCondition,
        },
        {
            label: phrase('TERMS_FIELD_USAGE', 'Användningsområden'),
            value: usage,
            setValue: setUsage,
        },
        {
            label: phrase('TERMS_FIELD_TAGS', 'Taggar'),
            value: tags,
            setValue: setTags,
        },
    ]

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_TERMS_HEADLINE"
                body="ADMIN_TERMS_BODY"
            />
            <AdminActionPanel
                onSave={() =>
                    onUpdate({
                        organization: organization.split('\n'),
                        unit: unit.split('\n'),
                        material: material.split('\n'),
                        condition: condition.split('\n'),
                        usage: usage.split('\n'),
                        tags: tags.split('\n'),
                    })
                }
                onRestore={() => bindings.forEach((v) => v.setValue(''))}
            />

            <Card>
                <CardContent>
                    <Grid container direction="row">
                        {bindings.map(({ label, value, setValue }) => (
                            <Grid key={label} item xs={12} sm={4} sx={{ p: 1 }}>
                                <TextField
                                    label={label}
                                    placeholder={label}
                                    fullWidth
                                    rows={10}
                                    multiline
                                    value={value}
                                    onChange={(e) =>
                                        setValue(e.currentTarget.value)
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
            <AdminActionPanel
                onSave={() =>
                    onUpdate({
                        organization: organization.split('\n'),
                        unit: unit.split('\n'),
                        material: material.split('\n'),
                        condition: condition.split('\n'),
                        usage: usage.split('\n'),
                        tags: tags.split('\n'),
                    })
                }
                onRestore={() => bindings.forEach((v) => v.setValue(''))}
            />
        </>
    )
}
