
import { 
    LOGIN_START, LOGIN_FAIL, LOGIN_SUCCESS,
    REGISTER_START, REGISTER_FAIL, REGISTER_SUCCESS, 
    LOGOUT,
    HIDE_ERROR,
    CHANGE_PASSWORD_START, CHANGE_PASSWORD_FAIL, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_READY,
    PRESENT_TOKEN_START, PRESENT_TOKEN_FAIL, PRESENT_TOKEN_SUCCESS, CHANGE_EMAIL,
    INDUSTRY_COLOR_START, INDUSTRY_COLOR_SUCCESS, INDUSTRY_COLOR_FAIL

} from "./authReducer"

import { BACKENDROOT, STORAGE_AUTH } from '../../index'
import axios from 'axios'
import { setOfflineModeOn } from '../app/appActions'
import * as http from '../../modules/http'
// import * as listActions from '../list/listActions'
// import * as collectionActions from '../collection/collectionActions'



export const changeIndustryColor = (sector: string, color: string) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().auth.loading) return
        if (!getState().auth.auth) return
        http.reduxHttpPost (
            dispatch,
            '/auth/industrycolor',
            {industry: sector, color: color},
            true,
            INDUSTRY_COLOR_START,
            INDUSTRY_COLOR_FAIL,
            INDUSTRY_COLOR_SUCCESS
        )
    }
}

export const changeEMail = (email: string) => {
    return { type: CHANGE_EMAIL, email: email } 
}

export const token = () => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().auth.loading) return
        if (getState().auth.auth !== null) return

        http.reduxHttpPost (
            dispatch,
            '/auth/token',
            {},
            true,
            PRESENT_TOKEN_START,
            PRESENT_TOKEN_FAIL,
            PRESENT_TOKEN_SUCCESS
        )
    }
}

export const login = (formData: any) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().auth.loading) return
        http.reduxHttpPost (
            dispatch,
            '/auth/login',
            formData,
            false,
            LOGIN_START,
            LOGIN_FAIL,
            LOGIN_SUCCESS
        )
    }
}

export const register = (formData: any) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().auth.loading) return

        http.reduxHttpPost (
            dispatch,
            '/auth/register',
            formData,
            false,
            REGISTER_START,
            REGISTER_FAIL,
            REGISTER_SUCCESS
        )
    }
}

export const changePassword = (password: string, newPassword: string) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().auth.loading) return


        dispatch(changePasswordStart());
        const data = {password: password, newPassword: newPassword}
        const header = { headers: { Authorization: `Bearer ${getState().auth.token}` } }

        axios
        .post(BACKENDROOT + '/auth/change', data, header)
        .then((res) => {
            if (res.data.success) {
                dispatch(changePasswordSuccess())                
            } else {
                dispatch(changePasswordFail(res.data.message))
            }            
        })
        .catch((err: any) => {
            if (err.response.data.message !== undefined) {
                dispatch(changePasswordFail(err.response.data.message))
            } else {
              dispatch(setOfflineModeOn())
              dispatch(changePasswordFail(err.message))
            }  
        })
    }
}
function changePasswordStart() { return { type: CHANGE_PASSWORD_START } }
function changePasswordFail(msg: string) { return { type: CHANGE_PASSWORD_FAIL, message: msg } }

function changePasswordSuccess() { 
    return { type: CHANGE_PASSWORD_SUCCESS } 
}

export function changePasswordReady() { 
    return { type: CHANGE_PASSWORD_READY } 
}

function executeLogout(): any { return {type: LOGOUT} }

export function logout(): any {
    return function (dispatch: any, getState: any)  {
        localStorage.removeItem(STORAGE_AUTH)
        sessionStorage.removeItem(STORAGE_AUTH)
        dispatch(executeLogout())
    }
}


export function hideAuthError(): any {
    return { type: HIDE_ERROR } 
}
