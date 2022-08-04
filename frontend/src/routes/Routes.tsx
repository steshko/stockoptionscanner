import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {useDispatch} from 'react-redux'

import useResize from '../hooks/useResize'

import MostActive from './mostActive/MostActive'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import Covered from './covered/Covered'
import Home from './home/Home'
import { NotFound} from './NotFound'
import Spread from './spread/Spread'
import Forgot from './auth/Forgot'
import AdminPanel from './adminPanel/AdminPanel'
import * as I from '../store/interfaces'
import * as appActions from '../store/app/appActions'
import { Settings } from './settings/Settings'

const Routes:React.FC = (props: any) =>  {
    const dispatch = useDispatch()

    const toggleResize = () => {
        window.innerWidth > I.SCREEN_MODE_IPAD
        ? dispatch(appActions.screenMode(null))
        : window.innerWidth > I.SCREEN_MODE_MOBILE
        ? dispatch(appActions.screenMode('ipad'))
        : dispatch(appActions.screenMode('mobile'))
    }

    useResize(toggleResize)

    return (
        <Switch>
            <Route component={ Home } path = '/' exact />
            {/* <Route component={ Covered } path = '/covered' exact /> */}
            <Route component={ Covered } path = '/covered' />
            <Route component={ Spread } path = '/spread' />
            <Route component={ MostActive } path = '/active' />
            <Route component={ AdminPanel } path = '/admin' />
            <Route component={ SignUp } path = '/signup' exact />
            <Route component={ SignIn } path = '/signin' exact />
            <Route component={ Forgot } path = '/forgot' exact />
            <Route component={ Settings } path = '/settings' exact />
            
            <Route component={ NotFound } path = '/404' />
            <Route component={ NotFound } path = '/' />
        </Switch>
    )
}

export default Routes