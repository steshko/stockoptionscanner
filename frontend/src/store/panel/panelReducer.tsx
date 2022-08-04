import { AnyAction } from 'redux'

export const ITEM_PANEL_OPEN = 'PANEL/ITEM_PANEL_OPEN'
export const ITEM_PANEL_CLOSE = 'PANEL/ITEM_PANEL_CLOSE'

const initialStateItemForm = {
    show: false,
    symbol: ''
}

export function panel(state: any | undefined = initialStateItemForm, action: AnyAction): any {
    switch (action.type) {
        case ITEM_PANEL_CLOSE:{
            // window.history.back()

            return {
                ...state,
                show: false
            }
        }
        case ITEM_PANEL_OPEN:{
            const pathname = window.location.pathname            
            window.history.pushState(null, '', (pathname === '/' ? '' : pathname)  + '/chain') 
            
            return {
                ...state,
                show: true,
                symbol: action.symbol
            }
        }
    }
    return state
}