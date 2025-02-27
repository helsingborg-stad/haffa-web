import {
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from '@mui/material'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { Advert, AdvertMutationResult } from 'adverts/types'
import { FC, useContext, useId, useState } from 'react'
import { Terms } from 'terms/types'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { PhraseContext } from 'phrases'
import { Editorial } from 'editorials'

export const PlacePanel: FC<{
    advert: Advert
    terms: Terms
    fields: AdvertFieldConfig
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, fields, terms: { places }, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const { patchAdvert } = useContext(AdvertsContext)
    const [place, setPlace] = useState(advert.place)
    const {
        meta: { canEdit },
    } = advert

    const label = fields.find((f) => f.name === 'place')?.label || 'Plats'
    const labelId = useId()
    return canEdit && places.length > 0 ? (
        <Card key="place">
            <CardContent>
                <Editorial
                    phraseKey="ADVERT_CHANGE_PLACE_EDITORIAL"
                    severity="info"
                />
                <Stack spacing={1} direction="row">
                    <FormControl fullWidth>
                        <InputLabel id={labelId}>{label}</InputLabel>
                        <Select
                            labelId={labelId}
                            value={place}
                            label={label}
                            onChange={(e) => setPlace(e.target.value)}
                        >
                            <MenuItem value="">
                                {phrase('VALUE_CLEAR', '(rensa värde)')}
                            </MenuItem>
                            {places.map((p) => (
                                <MenuItem value={p} key={p}>
                                    {p}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        onClick={() =>
                            onUpdate(patchAdvert(advert.id, { place }))
                        }
                    >
                        {phrase('ACTION_UPDATE', 'Uppdatera')}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    ) : null
}
