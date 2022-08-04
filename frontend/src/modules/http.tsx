import axios from 'axios'
import Qs from 'qs';
import { OFFLINE_MODE_ON } from '../store/app/appReducer'
import { BACKENDROOT, STORAGE_AUTH } from '../index'
import { locale } from '../ui/locale';

const authHeader = () => {
    const fromStorage = localStorage.getItem(STORAGE_AUTH) || sessionStorage.getItem(STORAGE_AUTH)
    const tokenData = fromStorage ? JSON.parse(fromStorage) : null
    if (!tokenData) {
        return {}
    }
    return { headers: { Authorization: `Bearer ${tokenData.token}` } }

}

export function paramsSerializer (params: any) {
    return Qs.stringify(params, {
      arrayFormat: 'brackets',
      filter: (prefix: any, value: any) => {
        if (
          value instanceof Date
        ) {
          return value.toISOString();
        }
        return value;
      },
    });
}

export function formDataSerializer (formData: any) {
    const data: any = {}  
    formData.forEach( (el: any) =>  {
        data[el.fieldName] = el.value instanceof Date ? el.value.toISOString() : el.value
    })
    return data
}

export const httpGetBlob = async (
    url: string,
    data: any,
    auth: boolean
) => {
    try {
        url = data ? url + '?' + paramsSerializer(data) : url

        const header: any = auth ? authHeader() : {}
        header.responseType = 'blob'

        const res = await axios.get(BACKENDROOT + url, header)

        // return res.data
        return {success: true, data: res.data}

    } catch (err) {
        return {success: false, message: err.message, data: err.response.data}
    }
}


export const reduxHttpGet = (
    dispatch: any,
    url: string,
    data: any | null,
    auth: boolean,
    START: string,
    ERROR: string,
    SUCCESS: string
    ) => {
        dispatch({ type: START })
        url = data ? url + '?' + paramsSerializer(data) : url

        const header = auth ? authHeader() : {}
        axios
        .get(BACKENDROOT + url, header)
        .then((res) => {
            dispatch( { type: SUCCESS, data: res.data } );
        })
        .catch((err: any) => {
            if (err.response && err.response.status === 500) {
                dispatch({type: OFFLINE_MODE_ON})
            }
            console.log('ERROR', err.message, data)
            dispatch({ type: ERROR, message: err.message, request: data });
        })
}

export const httpGet = async (
    url: string,
    data: any,
    auth: boolean
) => {
    try {
        url = data ? url + '?' + paramsSerializer(data) : url

        const header = auth ? authHeader() : {}

        const res = await axios.get(BACKENDROOT + url, header)

        return {success: true, data: res.data}

    } catch (err) {
        return {success: false, message: err.message, data: err.response.data}
    }
}

export const httpPost = async (
    url: string,
    formData: any,
    auth: boolean
) => {
    try {
        if (formData && Array.isArray(formData)) {
            formData = formDataSerializer(formData)
        } 
        let header: {} | null = {}
        if (auth) {
            header = authHeader()
            if (!header) {
                return {success: false, message: 'auth required'}
            }
        }

        const res = await axios.post(BACKENDROOT + url, formData, header)

        return {success: true, data: res.data}

    } catch (err) {
        return {success: false, message: err.message, data: err.response ? err.response.data : null}
    }
}

export const reduxHttpPost = (
    dispatch: any,
    url: string,
    formData: any | null,
    auth: boolean,
    START: string | null,
    ERROR: string | null,
    SUCCESS: string | null
    ) => {
        if (START) {
            dispatch({ type: START })
        }
        if (formData && Array.isArray(formData)) {
            formData = formDataSerializer(formData)
        } 
        let header: {} | null = {}

        if (auth) {
            header = authHeader()
            if (!header) {
                dispatch({ type: ERROR,  message: locale('auth.required') })
                return
            }    
        }

        axios
        .post(BACKENDROOT + url, formData, header)
        .then((res) => {
            if (SUCCESS) {
                dispatch( { type: SUCCESS, data: res.data } )
            }
        })
        .catch((err: any) => {

            if (err.response && err.response.data.formError) {
                // dispatch({ type: FORM_ERROR, formError: err.response.data.formError })
            }

            if (ERROR) {
                // console.log(err.response)
                dispatch({ 
                    type: ERROR, 
                    message: err.response?.data?.formError
                        ? err.response.data.formError.message 
                        : err.response?.data?.message || err.message 
                })
            }
        })
}