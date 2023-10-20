import {
    Alert,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    GridProps,
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
import { AdvertInput } from '../../../types'
import {
    SelectOption,
    useFormControls,
} from '../../../../hooks/use-form-controls'
import { PhraseContext } from '../../../../phrases/PhraseContext'
import { Category } from '../../../../categories/types'
import { ImageContainer, ImageInput } from './Image'

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

const SyncFromProfileInput: FC<{ onProfile: (profile: Profile) => void }> = ({
    onProfile,
}) => {
    const { signal } = useAbortController()
    const { getProfile } = useContext(ProfileContext)
    return (
        <Button
            onClick={() => getProfile({ signal }).then(onProfile)}
            startIcon={<RefreshIcon />}
        >
            Hämta från min profil
        </Button>
    )
}

const SyncToProfileInput: FC<{ patch: Partial<Profile> }> = ({ patch }) => {
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
            Uppdatera min profil
        </Button>
    )
}

const SyncProfileInput: FC<{
    patch: Partial<Profile>
    onProfile: (profile: Profile) => void
}> = ({ patch, onProfile }) => (
    <ButtonGroup>
        <SyncFromProfileInput onProfile={onProfile} />
        <SyncToProfileInput patch={patch} />
    </ButtonGroup>
)

const nextKey = (baseName: string): (() => string) => {
    let index = 0
    // eslint-disable-next-line no-plusplus
    return () => `${baseName}-${++index}`
}

export const AdvertForm: FC<{
    title: string
    error: string
    terms: Terms
    categories: Category[]
    advert: AdvertInput
    disabled: boolean
    onSave: (advert: AdvertInput) => void
}> = ({ title, advert, terms, error, onSave, disabled, categories }) => {
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

    interface ControlGroup {
        label: string
        rows: (() => JSX.Element | null)[][]
    }

    const layout = useMemo<ControlGroup[]>(
        () => [
            {
                label: phrase(
                    'ADVERT_EDITOR_SECTION_DESCRIPTION',
                    'Beskriv din annons så att den blir sökbar och ser fin ut i listningen.'
                ),
                rows: [
                    [
                        () =>
                            textField(
                                'title',
                                phrase('ADVERT_FIELD_TITLE', 'Titel'),
                                {
                                    required: true,
                                    disabled,
                                    fullWidth: true,
                                }
                            ),
                    ],
                    [
                        () =>
                            textField(
                                'description',
                                phrase(
                                    'ADVERT_FIELD_DESCRIPTION',
                                    'Beskrivning'
                                ),
                                {
                                    required: true,
                                    multiline: true,
                                    minRows: 4,
                                    disabled,
                                    fullWidth: true,
                                }
                            ),
                    ],
                    [
                        () =>
                            textField(
                                'quantity',
                                phrase('ADVERT_FIELD_QUANTITY', 'Antal'),
                                {
                                    required: true,
                                    type: 'number',
                                    inputProps: { min: 1 },
                                    disabled,
                                }
                            ),
                    ],
                    [
                        () =>
                            select(
                                'category',
                                phrase('ADVERT_FIELD_CATEGORY', 'Kategori'),
                                categories
                                    .map((c) => categoryToOptions(c))
                                    .flat(),
                                { fullWidth: true }
                            ),
                    ],
                    [
                        () =>
                            textField(
                                'reference',
                                phrase(
                                    'ADVERT_FIELD_REFERENCE',
                                    'Egen referens'
                                ),
                                {
                                    disabled,
                                    fullWidth: true,
                                }
                            ),
                    ],
                ],
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
                    ],
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
                    ],
                ],
            },
            {
                label: phrase(
                    'ADVERT_EDITOR_SECTION_LOCATION',
                    'Var finns prylen?'
                ),
                rows: [
                    [
                        () =>
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
                            ),
                        () =>
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
                            ),
                        () =>
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
                            ),
                    ],
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
                    ],
                ],
            },
            {
                label: phrase(
                    'ADVERT_EDITOR_SECTION_CONTACT',
                    'Vem kan man kontakta angående haffningar?'
                ),
                rows: [
                    [
                        () =>
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
                            ),
                        () =>
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
                            ),
                        () =>
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
                            ),
                    ],
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
                    ],
                ],
            },
            {
                label: phrase(
                    'ADVERT_EDITOR_SECTION_ADDITIONAL',
                    'Om det är viktigt, kan du ange ytterligare detaljer här.'
                ),
                rows: [
                    [
                        () =>
                            select(
                                'unit',
                                phrase('ADVERT_FIELD_UNIT', 'Enhet'),
                                makeOptions(terms.unit),
                                {
                                    fullWidth: true,
                                }
                            ),
                        () =>
                            select(
                                'material',
                                phrase('ADVERT_FIELD_MATERIAL', 'Material'),
                                makeOptions(terms.material),
                                {
                                    fullWidth: true,
                                }
                            ),
                        () =>
                            select(
                                'condition',
                                phrase('ADVERT_FIELD_CONDITION', 'Skick'),
                                makeOptions(terms.condition),
                                {
                                    fullWidth: true,
                                }
                            ),
                        () =>
                            select(
                                'usage',
                                phrase(
                                    'ADVERT_FIELD_USAGE',
                                    'Användningsområde'
                                ),
                                makeOptions(terms.usage),
                                {
                                    fullWidth: true,
                                }
                            ),
                    ],
                ],
            },
        ],
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
                        <Alert severity="error">{error}</Alert>
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
                                    <Cell key={cellIndex}>{cell()}</Cell>
                                ))}
                            </Row>
                        ))}
                    </CardContent>
                </Card>
            ))}
            {error && (
                <Row key="error-bottom">
                    <Cell>
                        <Alert severity="error">{error}</Alert>
                    </Cell>
                </Row>
            )}
            <Card>
                <CardActions>
                    <ButtonGroup fullWidth>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            disabled={disabled}
                            onClick={() => navigate('/')}
                        >
                            {phrase('ADVERT_EDIT_CANCEL', 'Avbryt')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={disabled}
                        >
                            {ADVERT_EDIT_SAVE}
                        </Button>
                    </ButtonGroup>
                </CardActions>
            </Card>
        </form>
    )
}
