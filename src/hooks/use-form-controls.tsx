import {
    Button,
    type ButtonProps,
    FormControl,
    type FormControlProps,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    type TextFieldProps,
} from '@mui/material'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { Phrase } from '../phrases/Phrase'

export interface SelectOption {
    label: string
    value: string
}

type SelectProps = FormControlProps & TextFieldProps & { label?: string }

type Getter<TModel, TValue> = (model: TModel) => TValue
type Setter<TModel, TValue> = (value: TValue) => Partial<TModel>

type ControlFactoryWithoutInitial<TModel, TValue, TProps> = (
    setter: Setter<TModel, TValue>,
    props?: Partial<TProps>
) => React.JSX.Element

type ControlFactory<TModel, TValue, TProps> = (
    getter: Getter<TModel, TValue>,
    setter: Setter<TModel, TValue>,
    props?: Partial<TProps>
) => React.JSX.Element

type ControlFactoryWithOptions<TModel, TValue, TOptions, TProps> = (
    getter: Getter<TModel, TValue>,
    setter: Setter<TModel, TValue>,
    options: TOptions,
    props?: Partial<TProps>
) => React.JSX.Element

export interface FormControlsFactory<TModel> {
    textField: ControlFactory<TModel, string, TextFieldProps>
    select: ControlFactoryWithOptions<
        TModel,
        string,
        SelectOption[],
        SelectProps
    >
    imagePicker: ControlFactoryWithoutInitial<TModel, string, ButtonProps>
}

export interface SimplifiedFormControlsFactory<TModel> {
    textField: (
        property: keyof TModel,
        label: string,
        props?: Partial<TextFieldProps>
    ) => React.JSX.Element
    select: (
        property: keyof TModel,
        label: string,
        options: SelectOption[],
        props?: Partial<SelectProps>
    ) => React.JSX.Element
}

export interface FormControlsState<TModel> {
    model: TModel
    patchModel: (patch: Partial<TModel>) => void
    factory: FormControlsFactory<TModel>
    simplifiedFactory: SimplifiedFormControlsFactory<TModel>
}

export const useFormControls = <TModel,>(
    initial: TModel
): FormControlsState<TModel> => {
    const [model, setModel] = useState(initial)

    const patchModel = useCallback(
        (patch: Partial<TModel>) =>
            setModel({
                ...model,
                ...patch,
            }),
        [model]
    )

    const textField: FormControlsFactory<TModel>['textField'] = (
        getter,
        setter,
        props
    ) => (
        <TextField
            {...props}
            value={getter(model)}
            onChange={(e) => patchModel(setter(e.target.value))}
        />
    )
    const select: FormControlsFactory<TModel>['select'] = (
        getter,
        setter,
        options,
        props
    ) => (
        <FormControl variant="outlined" sx={{ minWidth: 120 }} {...props}>
            <InputLabel id={props?.id || ''}>{props?.label}</InputLabel>
            <Select
                required={props?.required}
                fullWidth={props?.fullWidth}
                labelId={props?.id || ''}
                value={getter(model) || ''}
                label={props?.label}
                placeholder={props?.placeholder}
                onChange={(e) => patchModel(setter(e.target.value as string))}
            >
                <MenuItem key="clear" value="">
                    <em>Inget val</em>
                </MenuItem>
                {options.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )

    const imagePicker: FormControlsFactory<TModel>['imagePicker'] = (
        setter
    ) => (
        // render button as label since label will trigger inner hidden input...
        <Button variant="outlined" component="label">
            <Phrase id="ADVERT_UPLOAD_IMAGE" value="Välj en fin bild" />
            <input
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0] as File
                    const reader = new FileReader()
                    reader.onloadend = () =>
                        patchModel(setter(reader.result as string))
                    reader.readAsDataURL(file)
                }}
            />
        </Button>
    )

    const factory = useMemo<FormControlsFactory<TModel>>(
        () => ({
            textField,
            select,
            imagePicker,
        }),
        [select, imagePicker, textField]
    )

    const simplifiedFactory = useMemo<SimplifiedFormControlsFactory<TModel>>(
        () => ({
            textField: (property, label, props) =>
                textField(
                    (model) => model[property] as string,
                    (value) => ({ [property]: value }) as Partial<TModel>,
                    {
                        label,
                        placeholder: label,
                        ...props,
                    }
                ),
            select: (property, label, options, props) =>
                select(
                    (model) => model[property] as string,
                    (value) => ({ [property]: value }) as Partial<TModel>,
                    options,
                    {
                        label,
                        placeholder: label,
                        id: label,
                        ...props,
                    }
                ),
        }),
        [textField, select]
    )
    return { model, factory, simplifiedFactory, patchModel }
}
