import * as I from '../interfaces'
import { prepareCoveredIn } from './prepareData/prepareCoveredIn'
import { LOGIN_SUCCESS, PRESENT_TOKEN_SUCCESS, LOGOUT } from '../auth/authReducer'
import { ITEM_PANEL_CLOSE } from '../panel/panelReducer'
import { prepareCoveredOut } from './prepareData/prepareCoveredOut'
import { prepareSpreadPut } from './prepareData/prepareSpreadPut'
import { prepareSpreadCall } from './prepareData/prepareSpreadCall'
import { prepareDates } from './prepareData/prepareDates'
import { prepareActive } from './prepareData/prepareActive'

export const OFFLINE_MODE_ON = 'APP/OFFLINE_MODE_ON'
export const OFFLINE_MODE_OFF = 'APP/OFFLINE_MODE_OFF'

export const SCREEN_MODE = 'APP/SCREEN_MODE'
// export const MOBILE_MODE_OFF = 'APP/MOBILE_MODE_OFF'

export const DATES_START = 'APP/DATES_START'
export const DATES_ERROR = 'APP/DATES_ERROR'
export const DATES_SUCCESS = 'APP/DATES_SUCCESS'
export const SET_EXPDATE = 'APP/SET_EXPDATE'
export const SET_COVERED_DISCOUNT = 'APP/SET_COVERED_DISCOUNT'
export const SET_COVERED_TAB = 'APP/SET_COVERED_TAB'
export const SET_COVERED_STRIKE = 'APP/SET_COVERED_STRIKE'

export const COVERED_IN_START = 'APP/COVERED_IN_START'
export const COVERED_IN_ERROR = 'APP/COVERED_IN_ERROR'
export const COVERED_IN_SUCCESS = 'APP/COVERED_IN_SUCCESS'

export const COVERED_OUT_START = 'APP/COVERED_OUT_START'
export const COVERED_OUT_ERROR = 'APP/COVERED_OUT_ERROR'
export const COVERED_OUT_SUCCESS = 'APP/COVERED_OUT_SUCCESS'

export const BEST_COVERED_IN_START = 'APP/BEST_COVERED_IN_START'
export const BEST_COVERED_IN_ERROR = 'APP/BEST_COVERED_IN_ERROR'
export const BEST_COVERED_IN_SUCCESS = 'APP/BEST_COVERED_IN_SUCCESS'

export const EARNING_START = 'APP/EARNING_START'
export const EARNING_ERROR = 'APP/EARNING_ERROR'
export const EARNING_SUCCESS = 'APP/EARNING_SUCCESS'

export const DIVIDEND_START = 'APP/DIVIDEND_START'
export const DIVIDEND_ERROR = 'APP/DIVIDEND_ERROR'
export const DIVIDEND_SUCCESS = 'APP/DIVIDEND_SUCCESS'

export const SET_ACTIVE_TAB = 'APP/SET_ACTIVE_TAB'
export const ACTIVE_START = 'APP/ACTIVE_START'
export const ACTIVE_ERROR = 'APP/ACTIVE_ERROR'
export const ACTIVE_SUCCESS = 'APP/ACTIVE_SUCCESS'

export const SET_SPREAD_DISCOUNT = 'APP/SET_SPREAD_DISCOUNT'
export const SET_SPREAD_TAB = 'APP/SET_SPREAD_TAB'
export const SPREAD_PUT_START = 'APP/SPREAD_PUT_START'
export const SPREAD_PUT_ERROR = 'APP/SPREAD_PUT_ERROR'
export const SPREAD_PUT_SUCCESS = 'APP/SPREAD_PUT_SUCCESS'

export const SPREAD_CALL_START = 'APP/SPREAD_CALL_START'
export const SPREAD_CALL_ERROR = 'APP/SPREAD_CALL_ERROR'
export const SPREAD_CALL_SUCCESS = 'APP/SPREAD_CALL_SUCCESS'

export const BEST_SPREADS_PUT_START = 'APP/BEST_SPREADS_PUT_START'
export const BEST_SPREADS_PUT_ERROR = 'APP/BEST_SPREADS_PUT_ERROR'
export const BEST_SPREADS_PUT_SUCCESS = 'APP/BEST_SPREADS_PUT_SUCCESS'

export const MOVERS_CHART_START = 'APP/MOVERS_CHART_START'
export const MOVERS_CHART_ERROR = 'APP/MOVERS_CHART_ERROR'
export const MOVERS_CHART_SUCCESS = 'APP/MOVERS_CHART_SUCCESS'


const initialStateApp = (): I.App => {
    const loaded = sessionStorage.getItem('app')
    let loadedApp: I.App | null = null
    if (loaded) {
        try { loadedApp = JSON.parse(loaded) } catch (e) { loadedApp = null }
    }
    return {
        offlineMode: false,
        prepareMode: false,
        loading: false,
        reload: false,
        screenMode: window.innerWidth > I.SCREEN_MODE_IPAD ? null : window.innerWidth > I.SCREEN_MODE_MOBILE ? 'ipad' : 'mobile',

        calcYield: 100,
        marginInterest: 0,

        coveredDiscount: loadedApp && loadedApp.coveredDiscount ? loadedApp.coveredDiscount : 20,
        coveredDiscounts: [10, 20, 30, 40, 50, 60],
        coveredStrike: loadedApp && loadedApp.coveredStrike ? loadedApp.coveredStrike : 1,
        coveredStrikes: ['One strike up', 'Two strikes up'],
        coveredTab: loadedApp && loadedApp.coveredTab ? loadedApp.coveredTab : 0,
        expDate: loadedApp && loadedApp.expDate ? loadedApp.expDate : '',
        expDates: [] as string[],

        coveredInData: [],
        coveredInLoading: false,

        coveredOutData: [],
        coveredOutLoading: false,
        
        spreadDiscount: loadedApp && loadedApp.spreadDiscount ? loadedApp.spreadDiscount : 20,
        spreadDiscounts: [10, 20, 30, 40, 50, 60],
        spreadTab: loadedApp && loadedApp.spreadTab ? loadedApp.spreadTab : 0,
        spreadPutData: [],
        spreadPutLoading: false,
        spreadCallData: [],
        spreadCallLoading: false,

        earningListDataLoading: false,
        earningListData: [],
        dividendListDataLoading: false,
        dividendListData: [],

        bestCallData: [],
        bestCallLoading: false,

        bestSpreadPutData: [],
        bestSpreadPutLoading: false,
    
        topListTab: loadedApp && loadedApp.topListTab ? loadedApp.topListTab : 0,
        topListLoading: false,
        topList: {
            gainers: [],
            losers: [],
            active: [],
            "most-volatile": [],
            "large-cap": [],
            overbought: [],
            oversold: [],
            byIndex: []
        },
        moversChartLoading: false,
        moversChart: {gainers: [], losers: []}
    }
}
export const app = (state = initialStateApp(), action: any): I.App => {

    switch (action.type){
        case LOGIN_SUCCESS: {
            return {
                ...state, 
                calcYield: action.data.calcYield, 
                marginInterest: action.data.marginInterest
            }
        }
        case PRESENT_TOKEN_SUCCESS: {
            return {
                ...state, 
                calcYield: action.data.calcYield, 
                marginInterest: action.data.marginInterest
            }
        }
        case LOGOUT: {
            return {
                ...state, 
                calcYield: 100, 
                marginInterest: 0
            }
        }
        case MOVERS_CHART_START:{
            return {...state, moversChartLoading: true}
        }

        case MOVERS_CHART_SUCCESS:{
            return {
                ...state, 
                moversChartLoading: false, 
                moversChart: {
                    gainers: action.data.gainers,
                    losers: action.data.losers
                }, 
            }
        }
        case MOVERS_CHART_ERROR:{
            return {...state, moversChartLoading: false, moversChart: {gainers: [], losers: []}}
        }

        case SET_COVERED_TAB: {
            return {...state, coveredTab: action.tab}
        }
        case SET_COVERED_DISCOUNT: {
            return {...state, coveredDiscount: action.discount}
        }
        case SET_COVERED_STRIKE: {
            return {...state, coveredStrike: action.strike}
        }
        case SET_EXPDATE: {
            return {...state, expDate: action.expDate}
        }
        case DATES_START:{
            return {...state, loading: true}
        }
        case DATES_SUCCESS:{
            const expDate = Array.isArray(action.data) && action.data.length > 0
                ? action.data.includes(state.expDate) ? state.expDate : action.data[0]
                : ''
            return {
                ...state, 
                loading: false, 
                expDates: action.data, 
                expDate: state.expDate ? state.expDate : expDate ? expDate : state.expDate
            }
        }
        case DATES_ERROR:{
            return {...state, loading: false, expDates: ['loading error..']}
        }

        case COVERED_IN_START:{
            return {...state, coveredInLoading: true}
        }
        case COVERED_IN_SUCCESS:{
            if (action.data.prepareMode) {
                return {
                    ...state, 
                    prepareMode: true,
                    reload: false,
                    coveredInLoading: false, 
                    coveredInData: [], 
                }
            }
            const marginInterest = state.marginInterest
            const calcYield = state.calcYield
            prepareCoveredIn(action.data, marginInterest, calcYield)
            prepareDates(action.data, state.earningListData, state.dividendListData)
            return {
                ...state, 
                prepareMode: false,
                reload: false,
                coveredInLoading: false, 
                coveredInData: action.data, 
            }
        }
        case COVERED_IN_ERROR:{
            return {...state, coveredInLoading: false, coveredInData: []}
        }

        case BEST_COVERED_IN_START:{
            return {...state, bestCallLoading: true}
        }
        case BEST_COVERED_IN_SUCCESS:{
            if (action.data.prepareMode) {
                return {
                    ...state, 
                    prepareMode: true,
                    reload: false,
                    bestCallLoading: false, 
                    bestCallData: [], 
                }
            }

            const marginInterest = state.marginInterest
            const calcYield = state.calcYield
            prepareCoveredIn(action.data, marginInterest, calcYield)
            prepareDates(action.data, state.earningListData, state.dividendListData)
            return {
                ...state, 
                prepareMode: false,
                reload: false,
                bestCallLoading: false, 
                bestCallData: action.data, 
            }
        }
        case BEST_COVERED_IN_ERROR:{
            return {...state, bestCallLoading: false, bestCallData: []}
        }

        case BEST_SPREADS_PUT_START:{
            return {...state, bestSpreadPutLoading: true}
        }
        case BEST_SPREADS_PUT_SUCCESS:{
            if (action.data.prepareMode) {
                return {
                    ...state, 
                    prepareMode: true,
                    reload: false,
                    bestSpreadPutLoading: false, 
                    bestSpreadPutData: [], 
                }
            }

            const marginInterest = state.marginInterest
            const calcYield = state.calcYield
            prepareSpreadPut(action.data, marginInterest, calcYield)
            prepareDates(action.data, state.earningListData, state.dividendListData)
            return {
                ...state, 
                prepareMode: false,
                reload: false,
                bestSpreadPutLoading: false, 
                bestSpreadPutData: action.data, 
            }
        }
        case BEST_SPREADS_PUT_ERROR:{
            return {...state, bestSpreadPutLoading: false, bestSpreadPutData: []}
        }

        case COVERED_OUT_START:{
            return {...state, coveredOutLoading: true}
        }
        case COVERED_OUT_SUCCESS:{
            if (action.data.prepareMode) {
                return {
                    ...state, 
                    prepareMode: true,
                    reload: false,
                    coveredOutLoading: false, 
                    coveredOutData: [], 
                }
            }

            const marginInterest = state.marginInterest
            const calcYield = state.calcYield
            prepareCoveredOut(action.data, marginInterest, calcYield)
            prepareDates(action.data, state.earningListData, state.dividendListData)
            return {
                ...state, 
                prepareMode: false,
                reload: false,
                coveredOutLoading: false, 
                coveredOutData: action.data, 
            }
        }
        case COVERED_OUT_ERROR:{
            return {...state, coveredOutLoading: false, coveredOutData: []}
        }
        case SET_SPREAD_DISCOUNT: {
            return {...state, spreadDiscount: action.discount}
        }
        case SET_SPREAD_TAB: {
            return {...state, spreadTab: action.tab}
        }
        case SPREAD_PUT_START:{
            return {...state, spreadPutLoading: true}
        }
        case SPREAD_PUT_SUCCESS:{
            if (action.data.prepareMode) {
                return {
                    ...state, 
                    prepareMode: true,
                    reload: false,
                    spreadPutLoading: false, 
                    spreadPutData: [], 
                }
            }

            const marginInterest = state.marginInterest
            const calcYield = state.calcYield
            prepareSpreadPut(action.data, marginInterest, calcYield)
            prepareDates(action.data, state.earningListData, state.dividendListData)
            return {
                ...state, 
                prepareMode: false,
                reload: false,
                spreadPutLoading: false, 
                spreadPutData: action.data, 
            }
        }
        case SPREAD_PUT_ERROR:{
            return {...state, spreadPutLoading: false, spreadPutData: []}
        }
        case SPREAD_CALL_START:{
            return {...state, spreadCallLoading: true}
        }
        case SPREAD_CALL_SUCCESS:{
            if (action.data.prepareMode) {
                return {
                    ...state, 
                    prepareMode: true,
                    reload: false,
                    spreadCallLoading: false, 
                    spreadCallData: [], 
                }
            }

            const marginInterest = state.marginInterest
            const calcYield = state.calcYield
            prepareSpreadCall(action.data, marginInterest, calcYield)
            prepareDates(action.data, state.earningListData, state.dividendListData)
            return {
                ...state, 
                prepareMode: false,
                reload: false,
                spreadCallLoading: false, 
                spreadCallData: action.data, 
            }
        }
        case SPREAD_CALL_ERROR:{
            return {...state, spreadCallLoading: false, spreadCallData: []}
        }


        case EARNING_START: {
            return {...state, earningListDataLoading: true}
        }
        case EARNING_ERROR: {
            return {...state, earningListDataLoading: false, earningListData: []}
        }
        case EARNING_SUCCESS: {
            prepareDates(state.coveredInData, action.data, state.dividendListData)
            prepareDates(state.coveredOutData, action.data, state.dividendListData)
            prepareDates(state.spreadCallData, action.data, state.dividendListData)
            prepareDates(state.spreadPutData, action.data, state.dividendListData)
            prepareDates(state.bestCallData, action.data, state.dividendListData)
            prepareDates(state.bestSpreadPutData, action.data, state.dividendListData)

            prepareDates(state.topList.gainers, action.data, state.dividendListData)
            prepareDates(state.topList.losers, action.data, state.dividendListData)
            prepareDates(state.topList.active, action.data, state.dividendListData)
            prepareDates(state.topList.byIndex, action.data, state.dividendListData)
            prepareDates(state.topList['large-cap'], action.data, state.dividendListData)
            prepareDates(state.topList['most-volatile'], action.data, state.dividendListData)
            prepareDates(state.topList.overbought, action.data, state.dividendListData)
            prepareDates(state.topList.oversold, action.data, state.dividendListData)
            return {
                ...state, 
                earningListDataLoading: false, 
                earningListData: action.data
            }
        }

        case DIVIDEND_START: {
            return {...state, dividendListDataLoading: true}
        }
        case DIVIDEND_ERROR: {
            return {...state, dividendListDataLoading: false, dividendListData: []}
        }
        case DIVIDEND_SUCCESS: {
            prepareDates(state.coveredInData, state.earningListData, action.data)
            prepareDates(state.coveredOutData, state.earningListData, action.data)
            prepareDates(state.spreadCallData, state.earningListData, action.data)
            prepareDates(state.spreadPutData, state.earningListData, action.data)
            prepareDates(state.bestCallData, state.earningListData, action.data)
            prepareDates(state.bestSpreadPutData, state.earningListData, action.data)

            prepareDates(state.topList.gainers, state.earningListData, action.data)
            prepareDates(state.topList.losers, state.earningListData, action.data)
            prepareDates(state.topList.active, state.earningListData, action.data)
            prepareDates(state.topList.byIndex, state.earningListData, action.data)
            prepareDates(state.topList['large-cap'], state.earningListData, action.data)
            prepareDates(state.topList['most-volatile'], state.earningListData, action.data)
            prepareDates(state.topList.overbought, state.earningListData, action.data)
            prepareDates(state.topList.oversold, state.earningListData, action.data)

            return {
                ...state, 
                dividendListDataLoading: false, 
                dividendListData: action.data
            }
        }
        
        case SET_ACTIVE_TAB: {
            return {...state, topListTab: action.tab}
        }
        case ACTIVE_START:{
            return {...state, topListLoading: true}
        }
        case ACTIVE_SUCCESS:{
            prepareActive(action.data.list)
            prepareDates(action.data.list, state.earningListData, state.dividendListData)

            return {
                ...state, 
                topListLoading: false, 
                topList: {...state.topList, [action.data.report]: action.data.list}, 
            }
        }
        case ACTIVE_ERROR:{
            // console.log(action)
            return {
                ...state, 
                topListLoading: false, 
            }
        }
        case ITEM_PANEL_CLOSE:{
            return {
                ...state, 
                reload: true, 
            }

        }


        case OFFLINE_MODE_ON:{
            return {...state, offlineMode: true}
        }
        case OFFLINE_MODE_OFF:{
            return {...state, offlineMode: false}
        }
        case SCREEN_MODE:{
            return {...state, screenMode: action.screenMode}
        }
        // case MOBILE_MODE_OFF:{
        //     return {...state, mobileMode: false}
        // }
        default: return state
    }
}