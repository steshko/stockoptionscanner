import { locale } from "../ui/locale"


enum regExpValidator {
    Name = '^[А-ЯЁа-яёA-Za-z- ]{2,30}$',//'[A-ЯЁ ][а-яё ][A-Z ][a-z ]',
    userName = '^[a-z0-9_-]{3,16}$', //^[a-z0-9_-]{3,16}$
    password = '^(?=.*[A-Z])(?=.*[!@#$&%^*-=/+])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6,}$',
    money = '[0-9]{1,8}\.[0-9]{2}',
    number = '[0-9]{1,8}\.[0-9]{2}',
    email = '.+@.+\..+',
    phone = "^[0-9+/(]{1,1}[0-9-/(/)/ ]{9,16}[0-9]$",
    date = '',
    trueBoolean = '{1}',
    any = '',
}

export interface formField {
    fieldName: string,
    value: string,
    toched: boolean,
    error: string | null,
    type? : keyof typeof regExpValidator,
    requiredError?: string | null,
    typeError?: string | null
}

function check(value: string, type: keyof typeof regExpValidator | undefined): boolean {
    if (!type) return true
    const regExp = new RegExp(regExpValidator[type]) 
    return regExp.test(value) 
}
export function formFieldError(formFields: formField[], fieldName: string, formToched: boolean): string | null {
    const idx = formFields.findIndex( field => field.fieldName === fieldName)
    if (idx >= 0) {
        if (formFields[idx].toched && formFields[idx].error && formToched)
            return formFields[idx].error 
    }
    return null
}

export function checkFormField(formFields: formField[], fieldName: string, fieldValue: string) {

    const idx = formFields.findIndex( field => field.fieldName === fieldName)
    if (idx >= 0 ) {
        if (fieldValue !== '' && formFields[idx].typeError) {
            formFields[idx].error = check(fieldValue, formFields[idx].type) 
                ? null
                : locale(formFields[idx].typeError)
        } else if (formFields[idx].requiredError) {
            formFields[idx].error = fieldValue === ''
                ? locale(formFields[idx].requiredError)
                : null
        } else {
            formFields[idx].error = null
        }
    }
}
export function checkForm(formFields: formField[]): boolean {
    formFields.forEach( field => {
        field.toched = true
        checkFormField(formFields, field.fieldName, field.value)
    })
    return formFields.findIndex( field => field.error != null) < 0
}

export function fieldValue(formFields: formField[], fieldName: string): any {
    const idx = formFields.findIndex( field => field.fieldName === fieldName)
    if (idx >= 0 ) {
        return formFields[idx].value
    }
    return null
}

export const error = (fieldName: string, formData: formField[], touched: boolean): string | null  => {
    return locale(formFieldError(formData, fieldName, touched))
}
export const value = (fieldName: string, formData: formField[]): string => {
    const idx = formData.findIndex( field => field.fieldName === fieldName)
    if (idx >= 0) {
        return formData[idx].value
    }
    return ''
}

export function onChangeField(fieldName: string, value: any, formData: formField[], setFormData: any) {
    const idx = formData.findIndex( field => field.fieldName === fieldName)
    if (idx >= 0) {
        checkFormField(formData, formData[idx].fieldName, value)
        setFormData([
            ...formData.slice(0, idx), 
            {...formData[idx], value: value, toched: true},
            ...formData.slice(idx + 1), 
        ])
    }
}
export function setServerErrors(errors: any, formData: formField[], setFormData: any){
    if (Array.isArray(errors)) {
        errors.forEach((error: any) => {
            const idx=formData.findIndex((field: any) => field.fieldName === error.field)
            setFormData((prev: any) => [
                ...prev.slice(0, idx), 
                {...prev[idx], error: error.message},
                ...prev.slice(idx + 1), 
            ])
        })
    }
}

export function textFieldHelper(fieldName: string, formState: any, formData: formField[]) {
    const margin:'normal' = 'normal'
    const variant: 'outlined' = 'outlined'
    return {
        disabled: formState.loading,
        variant: variant,
        margin: margin,
        fullWidth: true,
        // required: true,
        id: fieldName,
        error: !!error(fieldName, formData, formState.touched),
        label: locale('auth.' + fieldName),
        name: fieldName,
        value: value(fieldName, formData),
        autoComplete: fieldName,
        helperText: error(fieldName, formData, formState.touched),
        // onChange: {onChangeField},
    }
  }    
