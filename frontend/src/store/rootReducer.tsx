import { combineReducers } from 'redux'
import { app } from './app/appReducer'
import { auth } from './auth/authReducer'
import { panel } from './panel/panelReducer'

export const rootReducer = combineReducers({ 
    app,
    auth,
    panel

})

