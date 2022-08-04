import React from 'react'
import { useDispatch } from 'react-redux';
import * as panelActions from '../../store/panel/panelActions'
import {useSelector} from 'react-redux'

export const DrawSymbol = (row: any) => {
    const dispatch = useDispatch()

    const onSymbolClick = (e: any) => {
        dispatch(panelActions.openSymbolPanel(row.symbol))
    }

    return (
        <>
            <div className="item-onclick" onClick={onSymbolClick}>
                <strong>
                    {row.symbol}
                </strong>
            </div>
            {row.type==='stock' 
            ? null 
            : <div><span className="description secondary">
                {row.type}
            </span></div>
            }
        </>
    )
}

export const DrawExchange = (row: any) => {
    return (
        <>
        <div>
            {row.code.indexOf(':') > 0 ? row.code.substr(0, row.code.indexOf(':')) : row.code}
        </div>
        </>
    )
}

export const DrawCompany = (row: any) => {
    const colorList = useSelector((state: any) => state.auth.industryColor )
    const colorIndex =  colorList
        ? colorList.findIndex((color: any) => color.industry === row.sector)
        : -1
    
    return (
        <>
            <div>{row.name}</div>
            <div><span 
                className={
                    colorIndex >= 0 && colorList[colorIndex].color !== 'default'
                    ? `sector palette-${colorList[colorIndex].color}`
                    : "description secondary"
                }
            >
                {row.sector}
            </span></div>
            <div><span className="description secondary">
                {row.industry}
            </span></div>

        </>
    )
}

export const DrawChange = (row: any) => {
  
    return (
        row.change && row.changePercent
        // ?<strong style={row.change<0?{color: red}:{color: green}}>
        //     {row.change.toFixed(2).toLocaleString()}&nbsp;{row.change<0?'▼':'▲'}&nbsp;{ row.changePercent.toFixed(2)  }% 
        // </strong>    
        ?<div><span className={"description " + (row.change < 0 ? "value-down" : "value-up" )}>
        {row.change.toFixed(2).toLocaleString('en-Us')}&nbsp;
        {row.change < 0 ? '▼' : '▲'}&nbsp;
        {(row.changePercent).toFixed(2)  }% 
        </span></div>

        :null
    )
}
export const DrawVolume = (row: any) => {
    return (
        <>
            {row.vol
            ? row.vol.toLocaleString()
            : row.volume
            ? row.volume.toLocaleString() 
            : null
            }
        </>
    )
}

export const DrawMarket = (row: any) => {
    return <>{Array.isArray(row.marketList) ? row.marketList.join(' ') : row.market}</>
}



