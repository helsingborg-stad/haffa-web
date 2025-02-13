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
    values: { label: string; value: string }[]
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
                {values.map(({ label, value }, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                checked={selected.includes(value)}
                                onChange={({ target: { checked } }) =>
                                    onChange(
                                        checked
                                            ? [...selected, value].filter(
                                                  uniqueBy((x) => x)
                                              )
                                            : selected.filter(
                                                  (x) => x !== value
                                              )
                                    )
                                }
                                name={value}
                            />
                        }
                        label={label}
                    />
                ))}
            </FormGroup>
        </AccordionDetails>
    </Accordion>
)
