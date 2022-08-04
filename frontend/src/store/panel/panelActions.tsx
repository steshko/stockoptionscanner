import { ITEM_PANEL_OPEN, ITEM_PANEL_CLOSE} from './panelReducer'


export function openSymbolPanel(symbol: string): any {
    return {
        symbol: symbol,
        type: ITEM_PANEL_OPEN
    }
}

export function closePanel(): any {
    return {
        type: ITEM_PANEL_CLOSE
    }
}
