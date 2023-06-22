import React, { useMemo, useState } from 'react'
import { TextField, TextFieldProps } from '@mui/material'


interface Getter<TModel, TValue> {
	(model: TModel): TValue
}
interface Setter<TModel, TValue> {
	(value: TValue): Partial<TModel>
}
interface ControlFactory<TModel, TValue, TProps> {
	(getter: Getter<TModel, TValue>,
		setter: Setter<TModel, TValue>,
		props?: Partial<TProps>): React.JSX.Element
}

interface FormControlsFactory<TModel> {
	textField: ControlFactory<TModel, string, TextFieldProps>
}

interface SimplifiedFormControlsFactory<TModel>{
	textField: (property: keyof TModel, label: string,props?: Partial<TextFieldProps>) => React.JSX.Element
}

export const useFormControls = <TModel,>(initial: TModel): [TModel, FormControlsFactory<TModel>, SimplifiedFormControlsFactory<TModel>] => {
	const [ model, setModel ] = useState(initial)

	const textField: ControlFactory<TModel, string, TextFieldProps> = (getter, setter, props) => (
		<TextField 
			{...props} 
			value={getter(model)}
			onChange={e => setModel({
				...model, ...setter(e.target.value) })
			}/>)

	const factory = useMemo<FormControlsFactory<TModel>>(() => ({
		textField,
	}), [ model, setModel ])

	const simplifiedFactory = useMemo<SimplifiedFormControlsFactory<TModel>>(() => ({
		textField: (property, label, props) => textField(
			model => model[property] as string,
			value => ({ [property]: value } as Partial<TModel>),
			{
				label,
				placeholder: label,
				...props,
			}),

	}), [ model, setModel ])
	return [ model, factory, simplifiedFactory ]
}
