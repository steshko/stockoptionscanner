import React from 'react'
import { useDispatch } from 'react-redux'
import * as I from '../../store/interfaces'
import * as panelActions from '../../store/panel/panelActions'

const DrawSymbol = (row: any) => {
    const dispatch = useDispatch()

    const onSymbolClick = (e: any) => {
        dispatch(panelActions.openSymbolPanel(row.symbol))
    }
    return (
        <>  
            <div onClick={onSymbolClick} className="item-onclick">
                <strong>
                    {row.symbol}
                </strong>
            </div>
            <div><span className="description secondary">
                {I.timeString(new Date(row.updatedAt))}
            </span></div>
        </>
    )
}

export default DrawSymbol