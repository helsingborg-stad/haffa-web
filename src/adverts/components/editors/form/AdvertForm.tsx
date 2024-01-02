import {
    Autocomplete,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Grid,
    GridProps,
    TextField,
} from '@mui/material'
import { FC, PropsWithChildren, useCallback, useContext, useMemo } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useNavigate } from 'react-router-dom'
import { Terms } from 'terms/types'
import { Profile, ProfileContext } from 'profile'
import useAbortController from 'hooks/use-abort-controller'
import { Editorial } from 'editorials'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { AdvertContact, AdvertInput, AdvertLocation } from '../../../types'
import {
    SelectOption,
    useFormControls,
} from '../../../../hooks/use-form-controls'
import { PhraseContext } from '../../../../phrases/PhraseContext'
import { Category } from '../../../../categories/types'
import { ImageContainer, ImageInput } from './Image'
import { TagEditor } from './TagEditor'

const swapArrayItems = <T,>(list: T[], index1: number, index2: number): T[] => {
    const l = [...list]
    const e = l[index1]
    l[index1] = l[index2]
    l[index2] = e
    return l
}

const Row: FC<PropsWithChildren & GridProps> = (props) => (
    <Grid container spacing={1} sx={{ pb: 2 }} {...props}>
        {props.children}
    </Grid>
)
const Cell: FC<PropsWithChildren & GridProps> = (props) => (
    <Grid item sx={{ flexGrow: 1 }} {...props}>
        {props.children}
    </Grid>
)

const SyncFromProfileInput: FC<{
    onProfile: (profile: Profile) => void
    label: string
}> = ({ onProfile, label }) => {
    const { signal } = useAbortController()
    const { getProfile } = useContext(ProfileContext)
    return (
        <Button
            onClick={() => getProfile({ signal }).then(onProfile)}
            startIcon={<RefreshIcon />}
        >
            {label}
        </Button>
    )
}

const SyncToProfileInput: FC<{ patch: Partial<Profile>; label: string }> = ({
    patch,
    label,
}) => {
    const { signal } = useAbortController()
    const { getProfile, updateProfile } = useContext(ProfileContext)
    return (
        <Button
            onClick={() =>
                getProfile({ signal })
                    .then((p) => ({
                        ...p,
                        ...patch,
                    }))
                    .then((p) => updateProfile(p, { signal }))
            }
            startIcon={<CloudUploadIcon />}
        >
            {label}
        </Button>
    )
}

const SyncProfileInput: FC<{
    patch: Partial<Profile>
    onProfile: (profile: Profile) => void
}> = ({ patch, onProfile }) => {
    const { phrase } = useContext(PhraseContext)

    return (
        <ButtonGroup>
            <SyncFromProfileInput
                label={phrase(
                    'ADVERT_BUTTON_SYNCH_FROM_PROFILE',
                    'Hämta från min profil'
                )}
                onProfile={onProfile}
            />
            <SyncToProfileInput
                label={phrase(
                    'ADVERT_BUTTON_SYNCH_TO_PROFILE',
                    'Uppdatera min profil'
                )}
                patch={patch}
            />
        </ButtonGroup>
    )
}

const nextKey = (baseName: string): (() => string) => {
    let index = 0
    // eslint-disable-next-line no-plusplus
    return () => `${baseName}-${++index}`
}

export const AdvertForm: FC<{
    title: string
    error: boolean
    terms: Terms
    categories: Category[]
    fields: AdvertFieldConfig
    locations: AdvertLocation[]
    advert: AdvertInput
    disabled: boolean
    onSave: (advert: AdvertInput) => void
}> = ({
    title,
    advert,
    terms,
    error,
    onSave,
    disabled,
    categories,
    fields,
    locations,
}) => {
    const { ERROR_UNKNOWN } = useContext(PhraseContext)
    const navigate = useNavigate()
    const {
        model,
        patchModel,
        factory,
        simplifiedFactory: { select, textField },
    } = useFormControls<AdvertInput>(advert)
    const { phrase, ADVERT_EDIT_SAVE } = useContext(PhraseContext)

    const makeOptions = (values: string[]) =>
        values.map((v) => ({ label: v, value: v }))

    const removeImage = useCallback(
        (index: number) => () =>
            patchModel({
                images: model.images.filter((_, i) => i !== index),
            }),
        [model, patchModel]
    )

    const moveImageUp = useCallback(
        (index: number) => {
            if (index === 0) {
                return
            }
            return () =>
                patchModel({
                    images: swapArrayItems(model.images, index, index - 1),
                })
        },
        [model, patchModel]
    )

    const moveImageDown = useCallback(
        (index: number) => {
            if (index >= model.images.length - 1) {
                return
            }
            return () =>
                patchModel({
                    images: swapArrayItems(model.images, index, index + 1),
                })
        },
        [model, patchModel]
    )

    const categoryToOptions = (
        category: Category,
        prefix: string | undefined = undefined,
        output: SelectOption[] = []
    ): SelectOption[] => {
        const label = prefix ? `${prefix} - ${category.label}` : category.label

        const childOutput =
            category.categories
                .map((c) => categoryToOptions(c, label))
                .flat() ?? []

        return [...output, { label, value: category.id }, ...childOutput]
    }

    const getFieldConfig = (name: string) => {
        const { visible = true, mandatory = false } =
            fields.find((f) => f.name === name) || {}
        return [visible, mandatory]
    }

    const createSimplifiedField = (
        field: keyof AdvertInput,
        factory: (field: keyof AdvertInput, required: boolean) => JSX.Element
    ) => {
        const [visible, mandatory] = getFieldConfig(field)
        return visible ? () => factory(field, mandatory) : null
    }

    const createComplexField = (
        field: keyof (AdvertContact & AdvertLocation),
        factory: (required: boolean) => JSX.Element
    ) => {
        const [visible, mandatory] = getFieldConfig(field)
        return visible ? () => factory(mandatory) : null
    }

    interface ControlGroup {
        label: string
        rows: ((() => JSX.Element) | null)[][]
    }

    const layout = useMemo<ControlGroup[]>(
        () =>
            [
                {
                    label: phrase(
                        'ADVERT_EDITOR_SECTION_DESCRIPTION',
                        'Beskriv din annons så att den blir sökbar och ser fin ut i listningen.'
                    ),
                    rows: [
                        [
                            createSimplifiedField('title', (field, required) =>
                                textField(
                                    field,
                                    phrase('ADVERT_FIELD_TITLE', 'Titel'),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                        ].filter((v) => v),
                        [
                            createSimplifiedField(
                                'description',
                                (field, required) =>
                                    textField(
                                        field,
                                        phrase(
                                            'ADVERT_FIELD_DESCRIPTION',
                                            'Beskrivning'
                                        ),
                                        {
                                            required,
                                            disabled,
                                            multiline: true,
                                            minRows: 4,
                                            fullWidth: true,
                                        }
                                    )
                            ),
                        ].filter((v) => v),
                        [
                            createSimplifiedField(
                                'quantity',
                                (field, required) =>
                                    textField(
                                        field,
                                        phrase(
                                            'ADVERT_FIELD_QUANTITY',
                                            'Antal'
                                        ),
                                        {
                                            required,
                                            disabled,
                                            fullWidth: true,
                                            type: 'number',
                                            inputProps: { min: 1 },
                                        }
                                    )
                            ),
                            createSimplifiedField('unit', (field, required) =>
                                select(
                                    field,
                                    phrase('ADVERT_FIELD_UNIT', 'Enhet'),
                                    makeOptions(terms.unit),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                            createSimplifiedField(
                                'category',
                                (field, required) =>
                                    select(
                                        field,
                                        phrase(
                                            'ADVERT_FIELD_CATEGORY',
                                            'Kategori'
                                        ),
                                        categories
                                            .map((c) => categoryToOptions(c))
                                            .flat(),
                                        { required, disabled, fullWidth: true }
                                    )
                            ),
                        ].filter((v) => v),
                    ].filter((v) => v.length > 0),
                },
                {
                    label: phrase(
                        'ADVERT_EDITOR_SECTION_IMAGES',
                        'En bild säger mer än tusen ord!'
                    ),
                    rows: [
                        [
                            () => (
                                <ImageContainer>
                                    {model.images.map(({ url }, index) => (
                                        <ImageInput
                                            key={url}
                                            url={url}
                                            onRemove={removeImage(index)}
                                            onMoveup={moveImageUp(index)}
                                            onMovedown={moveImageDown(index)}
                                        />
                                    ))}
                                </ImageContainer>
                            ),
                        ].filter((v) => v),
                        [
                            // append image
                            () =>
                                factory.imagePicker(
                                    (url) => ({
                                        images: [...model.images, { url }],
                                    }),
                                    {
                                        fullWidth: true,
                                    }
                                ),
                        ].filter((v) => v),
                    ].filter((v) => v.length > 0),
                },
                {
                    label: phrase(
                        'ADVERT_EDITOR_SECTION_ADDITIONAL',
                        'Om det är viktigt, kan du ange ytterligare detaljer här.'
                    ),
                    rows: [
                        [
                            createSimplifiedField('size', (field, required) =>
                                textField(
                                    field,
                                    phrase('ADVERT_FIELD_SIZE', 'Storlek'),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                            createSimplifiedField('width', (field, required) =>
                                textField(
                                    field,
                                    phrase('ADVERT_FIELD_WIDTH', 'Bredd'),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                            createSimplifiedField('height', (field, required) =>
                                textField(
                                    field,
                                    phrase('ADVERT_FIELD_HEIGHT', 'Höjd'),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                            createSimplifiedField('depth', (field, required) =>
                                textField(
                                    field,
                                    phrase('ADVERT_FIELD_DEPTH', 'Djup'),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                            createSimplifiedField('weight', (field, required) =>
                                textField(
                                    field,
                                    phrase('ADVERT_FIELD_WEIGHT', 'Vikt'),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                        ].filter((v) => v),
                        [
                            createSimplifiedField(
                                'material',
                                (field, required) =>
                                    select(
                                        field,
                                        phrase(
                                            'ADVERT_FIELD_MATERIAL',
                                            'Material'
                                        ),
                                        makeOptions(terms.material),
                                        {
                                            required,
                                            disabled,
                                            fullWidth: true,
                                        }
                                    )
                            ),
                            createSimplifiedField(
                                'condition',
                                (field, required) =>
                                    select(
                                        field,
                                        phrase(
                                            'ADVERT_FIELD_CONDITION',
                                            'Skick'
                                        ),
                                        makeOptions(terms.condition),
                                        {
                                            required,
                                            disabled,
                                            fullWidth: true,
                                        }
                                    )
                            ),
                            createSimplifiedField('usage', (field, required) =>
                                select(
                                    field,
                                    phrase(
                                        'ADVERT_FIELD_USAGE',
                                        'Användningsområde'
                                    ),
                                    makeOptions(terms.usage),
                                    {
                                        required,
                                        disabled,
                                        fullWidth: true,
                                    }
                                )
                            ),
                            createSimplifiedField(
                                'reference',
                                (field, required) =>
                                    textField(
                                        field,
                                        phrase(
                                            'ADVERT_FIELD_REFERENCE',
                                            'Egen referens'
                                        ),
                                        {
                                            required,
                                            disabled,
                                            fullWidth: true,
                                        }
                                    )
                            ),
                        ].filter((v) => v),
                        [
                            createSimplifiedField('tags', () => (
                                <TagEditor
                                    options={terms.tags}
                                    tags={model.tags}
                                    onUpdateTags={(tags) =>
                                        patchModel({ tags })
                                    }
                                    sx={{
                                        pt: 1,
                                    }}
                                />
                            )),
                        ].filter((v) => v),
                    ].filter((v) => v.length > 0),
                },
                {
                    label: phrase(
                        'ADVERT_EDITOR_SECTION_LOCATION',
                        'Var finns prylen?'
                    ),
                    rows: [
                        [
                            createComplexField('name', (required) => (
                                <Autocomplete
                                    freeSolo
                                    selectOnFocus
                                    handleHomeEndKeys
                                    clearOnBlur
                                    value={model.location.name}
                                    onChange={(_, v, reason) => {
                                        if (
                                            v &&
                                            reason === 'selectOption' &&
                                            typeof v !== 'string' &&
                                            v.key !== undefined
                                        ) {
                                            patchModel({
                                                ...model,
                                                location: {
                                                    ...locations[v.key],
                                                },
                                            })
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={phrase(
                                                'ADVERT_FIELD_LOCATION_NAME',
                                                'Namn'
                                            )}
                                            variant="outlined"
                                            required={required}
                                            onChange={(e) =>
                                                patchModel({
                                                    ...model,
                                                    location: {
                                                        ...model.location,
                                                        name: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    )}
                                    options={locations.map((m, key) => ({
                                        key,
                                        label: m.name,
                                    }))}
                                />
                            )),
                        ],
                        [
                            createComplexField('adress', (required) =>
                                factory.textField(
                                    (input) => input.location.adress,
                                    (v) => ({
                                        ...model,
                                        location: {
                                            ...model.location,
                                            adress: v,
                                        },
                                    }),
                                    {
                                        required,
                                        fullWidth: true,
                                        label: phrase(
                                            'ADVERT_FIELD_LOCATION_ADRESS',
                                            'Adress'
                                        ),
                                        placeholder: phrase(
                                            'ADVERT_FIELD_LOCATION_ADRESS',
                                            'Adress'
                                        ),
                                    }
                                )
                            ),
                            createComplexField('zipCode', (required) =>
                                factory.textField(
                                    (input) => input.location.zipCode,
                                    (v) => ({
                                        ...model,
                                        location: {
                                            ...model.location,
                                            zipCode: v,
                                        },
                                    }),
                                    {
                                        required,
                                        fullWidth: true,
                                        label: phrase(
                                            'ADVERT_FIELD_LOCATION_ZIPCODE',
                                            'Postnummer'
                                        ),
                                        placeholder: phrase(
                                            'ADVERT_FIELD_LOCATION_ZIPCODE',
                                            'Postnummer'
                                        ),
                                    }
                                )
                            ),
                            createComplexField('city', (required) =>
                                factory.textField(
                                    (input) => input.location.city,
                                    (v) => ({
                                        ...model,
                                        location: {
                                            ...model.location,
                                            city: v,
                                        },
                                    }),
                                    {
                                        required,
                                        fullWidth: true,
                                        label: phrase(
                                            'ADVERT_FIELD_LOCATION_CITY',
                                            'Stad'
                                        ),
                                        placeholder: phrase(
                                            'ADVERT_FIELD_LOCATION_CITY',
                                            'Stad'
                                        ),
                                    }
                                )
                            ),
                        ].filter((v) => v),
                        [
                            () => (
                                <SyncProfileInput
                                    patch={model.location}
                                    onProfile={(p) =>
                                        patchModel({
                                            location: p,
                                        })
                                    }
                                />
                            ),
                        ].filter((v) => v),
                    ].filter((v) => v.length > 0),
                },
                {
                    label: phrase(
                        'ADVERT_EDITOR_SECTION_CONTACT',
                        'Vem kan man kontakta angående haffningar?'
                    ),
                    rows: [
                        [
                            createComplexField('email', (required) =>
                                factory.textField(
                                    (input) => input.contact.email,
                                    (v) => ({
                                        ...model,
                                        contact: {
                                            ...model.contact,
                                            email: v,
                                        },
                                    }),
                                    {
                                        required,
                                        fullWidth: true,
                                        label: phrase(
                                            'ADVERT_FIELD_CONTACT_EMAIL',
                                            'Email'
                                        ),
                                        placeholder: phrase(
                                            'ADVERT_FIELD_CONTACT_EMAIL',
                                            'Email'
                                        ),
                                        type: 'email',
                                    }
                                )
                            ),
                            createComplexField('phone', (required) =>
                                factory.textField(
                                    (input) => input.contact.phone,
                                    (v) => ({
                                        ...model,
                                        contact: {
                                            ...model.contact,
                                            phone: v,
                                        },
                                    }),
                                    {
                                        required,
                                        fullWidth: true,
                                        label: phrase(
                                            'ADVERT_FIELD_CONTACT_PHONE',
                                            'Telefon'
                                        ),
                                        placeholder: phrase(
                                            'ADVERT_FIELD_CONTACT_PHONE',
                                            'Telefon'
                                        ),
                                        type: 'phone',
                                    }
                                )
                            ),
                            createComplexField('organization', (required) =>
                                factory.select(
                                    (input) => input.contact.organization,
                                    (v) => ({
                                        ...model,
                                        contact: {
                                            ...model.contact,
                                            organization: v,
                                        },
                                    }),
                                    makeOptions(terms.organization),
                                    {
                                        required,
                                        fullWidth: true,
                                        label: phrase(
                                            'ADVERT_FIELD_ORGANIZATION',
                                            'Organisation'
                                        ),
                                        placeholder: phrase(
                                            'ADVERT_FIELD_ORGANIZATION',
                                            'Organisation'
                                        ),
                                    }
                                )
                            ),
                        ].filter((v) => v),
                        [
                            () => (
                                <SyncProfileInput
                                    patch={model.contact}
                                    onProfile={(p) =>
                                        patchModel({
                                            contact: p,
                                        })
                                    }
                                />
                            ),
                        ].filter((v) => v),
                    ].filter((v) => v.length > 0),
                },
            ].filter((v) => v.rows.length > 0),
        [model]
    )
    const nextLayoutKey = nextKey('l')

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                onSave(model)
                return false
            }}
        >
            <CardHeader
                title={title}
                key={nextLayoutKey()}
                sx={{ display: 'none' }}
            />
            {error && (
                <Row key="error-top">
                    <Cell>
                        <Editorial severity="error" phraseKey="ERROR_UNKNOWN">
                            {ERROR_UNKNOWN}
                        </Editorial>
                    </Cell>
                </Row>
            )}
            {layout.map(({ label, rows }) => (
                <Card key={nextLayoutKey()} sx={{ my: 2 }}>
                    <CardHeader title={label} key={nextLayoutKey()} />
                    <CardContent key={nextLayoutKey()}>
                        {rows.map((row, rowIndex) => (
                            <Row key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <Cell xs key={cellIndex}>
                                        {cell?.()}
                                    </Cell>
                                ))}
                            </Row>
                        ))}
                    </CardContent>
                </Card>
            ))}
            {error && (
                <Row key="error-bottom">
                    <Cell>
                        <Editorial severity="error" phraseKey="ERROR_UNKNOWN">
                            {ERROR_UNKNOWN}
                        </Editorial>
                    </Cell>
                </Row>
            )}
            <Card>
                <CardActions>
                    <Container>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={disabled}
                            sx={{ mb: 1 }}
                        >
                            {ADVERT_EDIT_SAVE}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            startIcon={<CancelIcon />}
                            disabled={disabled}
                            onClick={() => navigate('/')}
                        >
                            {phrase('ADVERT_EDIT_CANCEL', 'Avbryt')}
                        </Button>
                    </Container>
                </CardActions>
            </Card>
        </form>
    )
}
