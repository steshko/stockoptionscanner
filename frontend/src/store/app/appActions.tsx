
import { 
    SCREEN_MODE, OFFLINE_MODE_ON, OFFLINE_MODE_OFF,
    DATES_START, DATES_ERROR, DATES_SUCCESS,
    SET_EXPDATE, SET_COVERED_DISCOUNT, SET_COVERED_STRIKE, SET_COVERED_TAB,
    COVERED_IN_START, COVERED_IN_ERROR, COVERED_IN_SUCCESS,
    BEST_COVERED_IN_START, BEST_COVERED_IN_ERROR, BEST_COVERED_IN_SUCCESS,
    COVERED_OUT_START, COVERED_OUT_ERROR, COVERED_OUT_SUCCESS,
    EARNING_START, EARNING_ERROR, EARNING_SUCCESS,
    DIVIDEND_START, DIVIDEND_ERROR, DIVIDEND_SUCCESS,
    SET_ACTIVE_TAB, ACTIVE_START, ACTIVE_ERROR, ACTIVE_SUCCESS,
    SPREAD_PUT_START, SPREAD_PUT_ERROR, SPREAD_PUT_SUCCESS, SET_SPREAD_TAB, SET_SPREAD_DISCOUNT,
    SPREAD_CALL_START, SPREAD_CALL_ERROR, SPREAD_CALL_SUCCESS,
    BEST_SPREADS_PUT_START, BEST_SPREADS_PUT_ERROR, BEST_SPREADS_PUT_SUCCESS,
    MOVERS_CHART_START, MOVERS_CHART_SUCCESS, MOVERS_CHART_ERROR

} from "./appReducer"
import * as http from '../../modules/http'
import * as I from '../interfaces'


export const moversChart = () => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.moversChartLoading) return

        http.reduxHttpGet (
            dispatch,
            '/chart/movers',
            {},
            true,
            MOVERS_CHART_START,
            MOVERS_CHART_ERROR,
            MOVERS_CHART_SUCCESS
        )
    }
}

export const spreadCall = (expDate: string, discount: number) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.spreadCallLoading) return

        http.reduxHttpGet (
            dispatch,
            '/spread/call',
            {exp: expDate, discount: discount},
            true,
            SPREAD_CALL_START,
            SPREAD_CALL_ERROR,
            SPREAD_CALL_SUCCESS
        )
    }
}

export const spreadPut = (expDate: string, discount: number) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.spreadPutLoading) return

        http.reduxHttpGet (
            dispatch,
            '/spread/put',
            {exp: expDate, discount: discount},
            true,
            SPREAD_PUT_START,
            SPREAD_PUT_ERROR,
            SPREAD_PUT_SUCCESS
        )
    }
}

export const topList = (reportType: number) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.topListLoading) return

        http.reduxHttpGet (
            dispatch,
            '/top/last',
            {report: I.reportType[reportType]},
            true,
            ACTIVE_START,
            ACTIVE_ERROR,
            ACTIVE_SUCCESS
        )
    }
}

export const bestSpreadsPut = () => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.bestSpreadPutLoading) return

        http.reduxHttpGet (
            dispatch,
            '/best/spreadsput',
            {},
            true,
            BEST_SPREADS_PUT_START,
            BEST_SPREADS_PUT_ERROR,
            BEST_SPREADS_PUT_SUCCESS
        )
    }
}

export const bestCoveredIn = () => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.bestCallLoading) return

        http.reduxHttpGet (
            dispatch,
            '/best/covered',
            {},
            true,
            BEST_COVERED_IN_START,
            BEST_COVERED_IN_ERROR,
            BEST_COVERED_IN_SUCCESS
        )
    }
}

export const coveredIn = (expDate: string, coveredDiscount: number) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.coveredInLoading) return

        http.reduxHttpGet (
            dispatch,
            '/covered/in',
            {exp: expDate, discount: coveredDiscount},
            true,
            COVERED_IN_START,
            COVERED_IN_ERROR,
            COVERED_IN_SUCCESS
        )
    }
}

export const coveredOut = (expDate: string, strike: number) => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.coveredOutLoading) return

        http.reduxHttpGet (
            dispatch,
            '/covered/out',
            {exp: expDate, strike: strike},
            true,
            COVERED_OUT_START,
            COVERED_OUT_ERROR,
            COVERED_OUT_SUCCESS
        )
    }
}

export const dividends = () => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.dividendListDataLoading) return

        http.reduxHttpGet (
            dispatch,
            '/dividends',
            {},
            false,
            DIVIDEND_START,
            DIVIDEND_ERROR,
            DIVIDEND_SUCCESS
        )
    }
}

export const ernings = () => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.earningListDataLoading) return

        http.reduxHttpGet (
            dispatch,
            '/earnings',
            {},
            false,
            EARNING_START,
            EARNING_ERROR,
            EARNING_SUCCESS
        )
    }
}

export function activeTabChange(tab: number): any { 
    return { 
        type: SET_ACTIVE_TAB, 
        tab: tab
    } 
}

export function coveredTabChange(tab: number): any { 
    return { 
        type: SET_COVERED_TAB, 
        tab: tab
    } 
}

export function spreadTabChange(tab: number): any { 
    return { 
        type: SET_SPREAD_TAB, 
        tab: tab
    } 
}

export function spreadSetDiscount(discount: number): any { 
    return { 
        type: SET_SPREAD_DISCOUNT, 
        discount: discount 
    } 
}

export function setExpDate(expDate: string): any { 
    return { 
        type: SET_EXPDATE, 
        expDate: expDate 
    } 
}

export function coveredSetDiscount(discount: number): any { 
    return { 
        type: SET_COVERED_DISCOUNT, 
        discount: discount 
    } 
}

export function coveredSetStrike(strike: number): any { 
    return { 
        type: SET_COVERED_STRIKE, 
        strike: strike 
    } 
}

export const loadDates = () => {
    return function (dispatch: any, getState: any)  {
        if (getState().app.offlineMode) return
        if (getState().app.loading) return
        if (getState().app.expDates.length > 0) return

        http.reduxHttpGet (
            dispatch,
            '/datesexp',
            {},
            false,
            DATES_START,
            DATES_ERROR,
            DATES_SUCCESS
        )
    }
}
    
export function screenMode(mode: any): any { 
    return { 
        type: SCREEN_MODE,
        screenMode: mode
    } 
}
// export function mobileModeOff(): any { return { type: MOBILE_MODE_OFF } }

export function setOfflineModeOn(): any { return { type: OFFLINE_MODE_ON } }
export function setOfflineModeOff(): any { return { type: OFFLINE_MODE_OFF } }
