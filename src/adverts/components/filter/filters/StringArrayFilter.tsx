import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from '@mui/material'
import { FC } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { uniqueBy } from 'lib/unique-by'

export const StringArrayFilter: FC<{
    label: string
    values: string[]
    selected: string[]
    onChange: (values: string[]) => void
}> = ({ label, values, selected, onChange }) => (
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={label}
            id={label}
        >
            {`${label} ${selected.length > 0 ? ' - ' : ''} ${selected.join(
                ', '
            )}`}
        </AccordionSummary>
        <AccordionDetails>
            <FormGroup>
                {values.map((v, key) => (
                    <FormControlLabel
                        key={key}
                        control={
                            <Checkbox
                                checked={selected.includes(v)}
                                onChange={({ target: { checked } }) =>
                                    onChange(
                                        checked
                                            ? [...selected, v].filter(
                                                  uniqueBy((x) => x)
                                              )
                                            : selected.filter((x) => x !== v)
                                    )
                                }
                                name={v}
                            />
                        }
                        label={v}
                    />
                ))}
            </FormGroup>
        </AccordionDetails>
    </Accordion>
)
