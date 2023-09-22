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
import {
    FC,
    Fragment,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
} from 'react'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { useNavigate } from 'react-router-dom'
import { AdvertTerms, AdvertInput } from '../../../types'
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
    <Grid container spacing={2} sx={{ pt: 2 }} {...props}>
        {props.children}
    </Grid>
)
const Cell: FC<PropsWithChildren & GridProps> = (props) => (
    <Grid item sx={{ flexGrow: 1 }} {...props}>
        {props.children}
    </Grid>
)

const nextKey = (baseName: string): (() => string) => {
    let index = 0
    // eslint-disable-next-line no-plusplus
    return () => `${baseName}-${++index}`
}

export const AdvertForm: FC<{
    title: string
    error: string
    terms: AdvertTerms
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
    const { phrase, SAVE_ADVERT } = useContext(PhraseContext)

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
        rows: (() => JSX.Element)[][]
    }

    const layout = useMemo<ControlGroup[]>(
        () => [
            {
                label: 'Beskriv din annons så att den blir sökbar och ser fin ut i listningen.',
                rows: [
                    [
                        () =>
                            textField('title', 'Titel', {
                                required: true,
                                disabled,
                                fullWidth: true,
                            }),
                    ],
                    [
                        () =>
                            textField('description', 'Beskrivning', {
                                required: true,
                                multiline: true,
                                minRows: 4,
                                disabled,
                                fullWidth: true,
                            }),
                    ],
                    [
                        () =>
                            textField('quantity', 'Antal', {
                                required: true,
                                type: 'number',
                                inputProps: { min: 1 },
                                disabled,
                            }),
                    ],
                ],
            },
            {
                label: 'En bild säger mer än tusen ord!',
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
                label: 'Om det är viktigt, kan du ange ytterligare detaljer här.',
                rows: [
                    [
                        () =>
                            select(
                                'category',
                                'Kategori',
                                categories
                                    .map((c) => categoryToOptions(c))
                                    .flat(),
                                { fullWidth: true }
                            ),
                    ],
                    [
                        () =>
                            select('unit', 'Enhet', makeOptions(terms.unit), {
                                fullWidth: true,
                            }),
                        () =>
                            select(
                                'material',
                                'Material',
                                makeOptions(terms.material),
                                {
                                    fullWidth: true,
                                }
                            ),
                        () =>
                            select(
                                'condition',
                                'Skick',
                                makeOptions(terms.condition),
                                {
                                    fullWidth: true,
                                }
                            ),
                        () =>
                            select(
                                'usage',
                                'Användningsområde',
                                makeOptions(terms.usage),
                                {
                                    fullWidth: true,
                                }
                            ),
                    ],
                ],
            },
            {
                label: 'Var finns prylen?',
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
                                    label: 'Adress',
                                    placeholder: 'Adress',
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
                                    label: 'Postnummer',
                                    placeholder: 'Postnummer',
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
                                    label: 'Stad',
                                    placeholder: 'Stad',
                                }
                            ),
                        () =>
                            factory.textField(
                                (input) => input.location.country,
                                (v) => ({
                                    ...model,
                                    location: {
                                        ...model.location,
                                        country: v,
                                    },
                                }),
                                {
                                    fullWidth: true,
                                    label: 'Land',
                                    placeholder: 'Land',
                                }
                            ),
                    ],
                ],
            },
            {
                label: 'Vem kan man kontakta angående haffningar?',
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
                                    label: 'Email',
                                    placeholder: 'Email',
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
                                    label: 'Telefon',
                                    placeholder: 'Telefon',
                                    type: 'phone',
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
        <Card
            component="form"
            onSubmit={(e) => {
                e.preventDefault()
                onSave(model)
                return false
            }}
        >
            <CardHeader title={title} key={nextLayoutKey()} />
            {error && (
                <CardContent key="error-top">
                    <Row>
                        <Cell>
                            <Alert severity="error">{error}</Alert>
                        </Cell>
                    </Row>
                </CardContent>
            )}
            {layout.map(({ label, rows }) => (
                <Fragment key={nextLayoutKey()}>
                    <CardHeader subheader={label} key={nextLayoutKey()} />
                    <CardContent key={nextLayoutKey()}>
                        {rows.map((row, rowIndex) => (
                            <Row key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <Cell key={cellIndex}>{cell()}</Cell>
                                ))}
                            </Row>
                        ))}
                    </CardContent>
                </Fragment>
            ))}
            {error && (
                <CardContent key="error-bottom">
                    <Row>
                        <Cell>
                            <Alert severity="error">{error}</Alert>
                        </Cell>
                    </Row>
                </CardContent>
            )}
            <CardActions>
                <ButtonGroup fullWidth>
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        disabled={disabled}
                        onClick={() => navigate('/')}
                    >
                        {phrase('', 'Avbryt')}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={disabled}
                    >
                        {SAVE_ADVERT}
                    </Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    )
}
