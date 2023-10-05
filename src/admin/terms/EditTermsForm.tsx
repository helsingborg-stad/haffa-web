import { Button, Grid, TextField } from '@mui/material'
import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'
import { Terms } from 'terms/types'
import { Editorial } from 'editorials'

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

    interface TermBinding {
        label: string
        value: string
        setValue: typeof setOrganization
    }

    const bindings: TermBinding[] = [
        {
            label: phrase('', 'Organisationer'),
            value: organization,
            setValue: setOrganization,
        },
        { label: phrase('', 'Enheter'), value: unit, setValue: setUnit },
        {
            label: phrase('', 'Material'),
            value: material,
            setValue: setMaterial,
        },
        {
            label: phrase('', 'Skick'),
            value: condition,
            setValue: setCondition,
        },
        {
            label: phrase('', 'Användningsområden'),
            value: usage,
            setValue: setUsage,
        },
    ]

    return (
        <>
            <Editorial>
                Definitioner editeras som textblock där varje rad utgör ett
                valbart värde i profil och annonseditor. Ändringar i
                definitioner uppdaterar inte existerande profiler och annonser
                och kan påverka statistiken negativt.
            </Editorial>
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
                            onChange={(e) => setValue(e.currentTarget.value)}
                        />
                    </Grid>
                ))}
            </Grid>
            <Button
                onClick={() =>
                    onUpdate({
                        organization: organization.split('\n'),
                        unit: unit.split('\n'),
                        material: material.split('\n'),
                        condition: condition.split('\n'),
                        usage: usage.split('\n'),
                    })
                }
            >
                Spara
            </Button>
        </>
    )
}

/*
{bindings.map(({ label, value, setValue }) => (
	<Grid item xs={12} sm={4}>
			<Card sx={{ m: 1 }}>
					<CardHeader title={label} />
					<TextField
							fullWidth
							rows={10}
							multiline
							value={value}
							onChange={(e) =>
									setValue(e.currentTarget.value)
							}
					/>
			</Card>
	</Grid>
))}
*/
