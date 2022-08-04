import * as I from '../interfaces'
import { STORAGE_AUTH } from '../../index'
import { locale } from '../../ui/locale'

export const LOGIN_START = 'AUTH/LOGIN_START'
export const LOGIN_FAIL = 'AUTH/LOGIN_FAIL'
export const LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS'

export const REGISTER_START = 'AUTH/REGISTER_START'
export const REGISTER_FAIL = 'AUTH/REGISTER_FAIL'
export const REGISTER_SUCCESS = 'AUTH/REGISTER_SUCCESS'

export const PRESENT_TOKEN_START = 'AUTH/PRESENT_TOKEN_START'
export const PRESENT_TOKEN_FAIL = 'AUTH/PRESENT_TOKEN_FAIL'
export const PRESENT_TOKEN_SUCCESS = 'AUTH/PRESENT_TOKEN_SUCCESS'

export const LOGOUT = 'AUTH/LOGOUT'
export const HIDE_ERROR = 'AUTH/HIDE_ERROR'

export const CHANGE_PASSWORD_START = 'AUTH/CHANGE_PASSWORD_START'
export const CHANGE_PASSWORD_FAIL = 'AUTH/CHANGE_PASSWORD_FAIL'
export const CHANGE_PASSWORD_SUCCESS = 'AUTH/CHANGE_PASSWORD_SUCCESS'
export const CHANGE_PASSWORD_READY = 'AUTH/CHANGE_PASSWORD_READY'
export const CHANGE_EMAIL = 'AUTH/CHANGE_EMAIL'

export const INDUSTRY_COLOR_START = 'AUTH/INDUSTRY_COLOR_START'
export const INDUSTRY_COLOR_SUCCESS = 'AUTH/INDUSTRY_COLOR_SUCCESS'
export const INDUSTRY_COLOR_FAIL = 'AUTH/INDUSTRY_COLOR_FAIL'


const initialStateAuth: I.Auth = {
    auth: null,
    userName: null,
    email: null,
    roles: [],
    userId: null,
    loading: false,

    industryColor: [],
    calcYield: 100,
    minStockPrice: 0,
    maxStockPrice: 9999,
    marginInterest: 0,

    passwordChanged: false,
    emailVerified: false,
    error: null    
}

export const auth = (state = initialStateAuth, action: any) => {

    switch (action.type){


        case INDUSTRY_COLOR_START: {
            return {...state, loading: true}
        }
        case INDUSTRY_COLOR_FAIL: {
            return {...state, loading: false}
        }
        case INDUSTRY_COLOR_SUCCESS: {
            return {
                ...state, 
                loading: false,
                industryColor: action.data
            }
        }

        case REGISTER_START:{
            return {...state, loading: true}
        }
        case REGISTER_FAIL:{
            return {...initialStateAuth, error: locale(action.message)}
        }
        case REGISTER_SUCCESS:{
            sessionStorage.setItem(STORAGE_AUTH, JSON.stringify((
                {userId: action.data.userId, token: action.data.token}
            )))
            return ({
                auth: true,
                email: action.data.email,
                roles: action.data.roles,
                userId: action.data.userId,
                loading: false,
            
                industryColor: action.data.industryColor,
                calcYield: action.data.calcYield,
                minStockPrice: action.data.minStockPrice,
                maxStockPrice: action.data.maxStockPrice,
                marginInterest: action.data.marginInterest,
            
                passwordChanged: false,
                emailVerified: false,
                error: null    
            })
        }
        case HIDE_ERROR:{
            return {...state, error: null}
        }
        case LOGOUT:{
            return initialStateAuth
        }
        case LOGIN_START:{
            return {...state, loading: true}
        }
        case LOGIN_FAIL:{
            console.log(action)
            return {...initialStateAuth, error: locale(action.message)}
        }
        case LOGIN_SUCCESS:{
            if (action.data.rememberMe) {
                localStorage.setItem(STORAGE_AUTH, JSON.stringify((
                    {userId: action.data.userId, token: action.data.token}
                )))
            } else {
                sessionStorage.setItem(STORAGE_AUTH, JSON.stringify((
                    {userId: action.data.userId, token: action.data.token}
                )))
            }
            return ({
                auth: true,
                userName: action.data.email.split('@')[0],
                email: action.data.email,
                roles: action.data.roles,
                userId: action.data.userId,
                loading: false,
            
                industryColor: action.data.industryColor,
                calcYield: action.data.calcYield,
                minStockPrice: action.data.minStockPrice,
                maxStockPrice: action.data.maxStockPrice,
                marginInterest: action.data.marginInterest,
            
                passwordChanged: false,
                emailVerified: action.data.emailVerified,
                error: null    
            })
        }
        case PRESENT_TOKEN_START:{
            return {...state, loading: true}
        }
        case PRESENT_TOKEN_FAIL:{
            return {...initialStateAuth}
        }
        case PRESENT_TOKEN_SUCCESS:{
            return ({
                auth: true, 
                userName: action.data.email.split('@')[0], 
                userId: action.data.userId, 
                email: action.data.email,
                emailVerified: action.data.emailVerified,
                roles: action.data.roles,
                marginInterest: action.data.marginInterest,
                industryColor: action.data.industryColor,
                calcYield: action.data.calcYield,
                loading: false, 
                error: null
            })
        }
        case CHANGE_PASSWORD_START: {
            return {...state, loading: true, passwordChanged: false}
        }
        case CHANGE_PASSWORD_FAIL: {
            return {...state, loading: false, error: action.message, passwordChanged: false}
        }
        case CHANGE_PASSWORD_SUCCESS: {
            return {...state, loading: false, passwordChanged: true}
        }
        case CHANGE_PASSWORD_READY: {
            return {...state, passwordChanged: false}
        }
        case CHANGE_EMAIL: {
            return {...state, emailVerified: false, email: action.email}
        }
        default: return state
    }
}