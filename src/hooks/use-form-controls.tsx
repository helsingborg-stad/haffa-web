import React, { useMemo, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectProps, TextField, TextFieldProps } from '@mui/material'

interface SelectOption {
	label: string
	value: string
}
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

interface ControlFactoryWithOptions<TModel, TValue, TOptions, TProps> {
	(getter: Getter<TModel, TValue>,
		setter: Setter<TModel, TValue>,
		options: TOptions,
		props?: Partial<TProps>): React.JSX.Element
}

export interface FormControlsFactory<TModel> {
	textField: ControlFactory<TModel, string, TextFieldProps>
	select: ControlFactoryWithOptions<TModel, string, SelectOption[], SelectProps>
}

export interface SimplifiedFormControlsFactory<TModel>{
	textField: (property: keyof TModel, label: string, props?: Partial<TextFieldProps>) => React.JSX.Element
	select: (
		property: keyof TModel, 
		label: string, 
		options: SelectOption[],
		props?: Partial<SelectProps>) => React.JSX.Element
}

export interface FormControlsState<TModel> {
	model: TModel,
	factory: FormControlsFactory<TModel>,
	simplifiedFactory: SimplifiedFormControlsFactory<TModel>
}

export const useFormControls = <TModel,>(initial: TModel): FormControlsState<TModel> => {
	const [ model, setModel ] = useState(initial)

	const textField: ControlFactory<TModel, string, TextFieldProps> = (getter, setter, props) => (
		<TextField 
			{...props} 
			value={getter(model)}
			onChange={e => setModel({
				...model, ...setter(e.target.value) })
			}/>)

	const select: ControlFactoryWithOptions<TModel, string, SelectOption[], SelectProps> = (getter, setter, options, props) => (
		<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
			<InputLabel id={props?.id || ''}>{props?.label}</InputLabel>
			<Select
				{...props}
				labelId={props?.id || ''}
				value={getter(model)}
				onChange={e => setModel({
					...model, ...setter(e.target.value as string) })
				}>
				{options.map(({ label, value }) => (<MenuItem value={value}>{label}</MenuItem>))}	
			</Select>
		</FormControl>)

	const factory = useMemo<FormControlsFactory<TModel>>(() => ({
		textField,
		select,
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
		select: (property, label, options, props) => select(
			model => model[property] as string,
			value => ({ [property]: value } as Partial<TModel>),
			options,
			{
				label,
				placeholder: label,
				id: label,
				...props,
			}),

	}), [ model, setModel ])
	return { model, factory, simplifiedFactory }
}
