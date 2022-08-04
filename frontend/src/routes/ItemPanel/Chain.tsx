import React, { useState, useEffect, useMemo, useCallback} from 'react'
import * as http from '../../modules/http'
import useDebounce from '../../hooks/useDebounce';
import {useSelector} from 'react-redux'
import * as I from '../../store/interfaces'
import CoveredInTable from './CoveredInTable';
import { Loader } from '../../modules/Loader';
import useBackNavigate from '../../hooks/useBackNavigate'
import { useDispatch } from 'react-redux'
import * as panelActions from '../../store/panel/panelActions'
import CoveredOutTable from './CoveredOutTable';
import Spreads from './Spreads';
import { PageTabs } from '../../modules/PageTabs';



const ANY_DATE = "Any date"
const ANY_STRIKE = "Any"

const initialPageData = {
    symbol: '',
    loading: false,
    valid: false,
    error: '',
    earn: null as I.earningList | null,
    div: null as I.dividendList | null,
    tabIndex: 0,
    showAllSpreads: false,
    expDate: ANY_DATE,
    strike: ANY_STRIKE,
    expDates: [] as string[],
    strikes: [] as string[],
    data: null as any | null
}

export default function Chain(props: any) {
    const dispatch = useDispatch()
    const app = useSelector((state: any) => state.app )

    const [pageData, setPageData] = useState({...initialPageData, symbol: props.symbol})
    const defferSymbol = useDebounce(pageData.symbol, 1000)
    const earnings = useSelector( (state: any) => state.app.earningListData )
    const auth = useSelector( (state: any) => state.auth )
    const dividends = useSelector( (state: any) => state.app.dividendListData )

    // useBackNavigate(onBackNavigate)
    useBackNavigate(() => dispatch(panelActions.closePanel()))
    

    const onSymbolChange = (e: any) => {
        setPageData((prev) => ({...prev, symbol: e.target.value.toUpperCase()}))
    }

    useEffect (() => {
        sessionStorage.setItem('chain', JSON.stringify({
            symbol: defferSymbol,
            tabIndex: pageData.tabIndex,
            showAllSpreads: pageData.showAllSpreads,
            expDate: pageData.expDate,
            strike: pageData.strike,
        }))    
    }, [defferSymbol, pageData])

    useEffect (() => {
        (async () => {
            setPageData(prev => ({...prev, loading: true, vaid: false}))
            const result = await http.httpGet(
                '/chain/symbol',
                {symbol: defferSymbol},
                true
            )
            if (result.success) {

                const earnIndex = earnings.findIndex( (el: any) => el.symbol === defferSymbol)
                const divIndex = dividends.findIndex( (el: any) => el.symbol === defferSymbol)

                const dates: string[] = Array.from( new Set(result.data.coveredChain.map((el: any) => el.expDate)))
                const strikes: string[] = Array.from( new Set(result.data.coveredChain.map((el: any) => el.strikePrice)))
                strikes.sort((a: string, b: string) => parseInt(a) - parseInt(b))
                setPageData(prev => ({
                    ...prev, 
                    loading: false, 
                    valid: true,
                    expDate: dates.includes(prev.expDate) 
                        ? prev.expDate 
                        : dates.length > 0 ? dates[0] : ANY_DATE,
                    expDates: [ANY_DATE, ...dates],
                    strike:  strikes.includes(prev.strike) 
                    ? prev.strike 
                    : ANY_STRIKE,
                    strikes: [ANY_STRIKE, ...strikes],
                    earn: earnIndex >= 0 ? earnings[earnIndex] : null,
                    div: divIndex >= 0 ? dividends[divIndex] : null,
                    data: result.data,
                    error: ''
                }))
            } else {
                setPageData(prev => ({
                    ...prev, 
                    loading: false, 
                    valid: false, 
                    earn: null,
                    div: null,
                    error: result.data && result.data.message ? result.data.message : result.message
                }))
            }
        })()
    }, [defferSymbol, earnings, dividends])


    const data = useMemo(() => {
        if (!pageData.data || !pageData.data.coveredChain) return []
        return pageData.tabIndex === 0
        ? pageData.data.coveredChain.filter((el: any) => (
            (el.expDate === pageData.expDate || pageData.expDate === ANY_DATE)
            && 
            (el.strikePrice === pageData.strike || pageData.strike === ANY_STRIKE) 
            &&
            el.strikeNum < 0        
        )).map((row: any) => {
            const margin = (row.strikePrice * (auth.marginInterest/100) /365 * (row.daysToExp + 5))

            row.interest = ((row.strikePrice - row.netDebitMid - margin)/row.netDebitMid*365/(row.daysToExp+3)*100)
            row.calcMargineInt = margin
            row.calc = Math.floor((365*100* (row.strikePrice - row.calcMargineInt)/(auth.calcYield * (row.daysToExp + 3) + 365 * 100))*100)/100
    
            return {
                ...row, 
            }
        })
        : pageData.tabIndex === 1
        ?pageData.data.coveredChain.filter((el: any) => (
            (el.expDate === pageData.expDate || pageData.expDate === ANY_DATE)
            && 
            (el.strikePrice === pageData.strike || pageData.strike === ANY_STRIKE) 
            &&
            el.strikeNum > 0        
        )).map((row: any) => {
            const margin = (row.strikePrice * (auth.marginInterest/100) /365 * (row.daysToExp + 5))

            row.yeld = ((row.mid - margin) / row.underPrice * 100)
            row.interest = ((row.mid - margin) / row.underPrice * 365 / (row.daysToExp + 5) * 100)
            row.calcMargineInt = margin
            row.calc = ((row.underPrice * (row.daysToExp + 5) / 365) * auth.calcYield/100)
            return {
                ...row, 
            }
        })
        : {
            call: pageData.data.spreadCallChain.filter((el: any) => (
                (el.expDate === pageData.expDate || pageData.expDate === ANY_DATE)
            )), 
            put: pageData.data.spreadPutChain.filter((el: any) => (
                (el.expDate === pageData.expDate || pageData.expDate === ANY_DATE)
            ))
        }

    }, [pageData.expDate, pageData.strike, pageData.tabIndex, pageData.data, auth.marginInterest, auth.calcYield])

    const onTabChange = (event: any, tab: number) => {
        event.preventDefault()
        setPageData(prev => ({...prev, tabIndex: tab}))
    }

    const onChangeDate = (event: any, date: string) => {
        event.preventDefault()
        setPageData(prev => ({...prev, expDate: date}))
    }

    const onChangeStrike = (event: any, strike: string) => {
        event.preventDefault()
        setPageData(prev => ({...prev, strike: strike}))
    }

    const closePanel = () => {
        window.history.back()
    }

    const DrawExpiration = useCallback((row: any) => {
        return (
            <span className={
                pageData.earn && (new Date(pageData.earn.date)).toISOString() <= row.expDate 
                ? "value-down" 
                : pageData.div && (new Date(pageData.div.exDivDate)).toISOString() <= row.expDate 
                ? "value-up"
                : ""
            }>
                {I.getDateString(row.expDate)}
            </span>
        )
    }, [pageData.div, pageData.earn])

    return (

        !pageData.data && !pageData.error
        ? <Loader /> 
        :<> 
        <div className="details-title">
            <div className="toolbar">
                <button className="btn link" onClick={e => closePanel()}>← Back</button>
            </div>
            {!pageData.data
            ? null
            :<>
            <div className={pageData.loading || !pageData.valid ? "disabled" : ""}>
                <h3>{pageData.data && pageData.data.marketData ? pageData.data.marketData.name : null}</h3>
                <p>{pageData.data.marketData.sector}</p>
                <p>{pageData.data.marketData.industry}</p>
                <div className="indicators-details">
                    <span><h3>{pageData.data.marketData.last}</h3></span>
                    <span className={pageData.data.marketData.change > 0 ? "value-up" : "value-down"}>
                        {pageData.data.marketData.change.toFixed(2)}&nbsp;
                        {pageData.data.marketData.change > 0 ? "▲" : "▼"}
                        &nbsp;{pageData.data.marketData.percentChange.toFixed(2)}
                    </span>
                </div>
                <p>
                    {pageData.earn
                    ?<>
                        <strong>Earnings:</strong><br /> 
                        {(new Date(pageData.earn.date)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + 
                        (pageData.earn.estimate ? ' (' + pageData.earn.estimate.toFixed(2) + ')' : '') + ' ' +
                        pageData.earn.time}
                    </>
                    : <>&nbsp;</>
                    }
                    </p>
                    <p>
                    {pageData.div
                    ?<>
                        <strong>Dividends:</strong><br /> 
                        {(new Date(pageData.div.exDivDate)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
                        (pageData.div.amount ? ' (' + pageData.div.amount.toFixed(2) + ')' : '')}
                    </>
                    : <>&nbsp;</>
                    }
                </p>
            </div>
            </>
            }
            <div className="toolbar">
                <div className="toolbar-filter">
                    <div>
                        <span>Symbol</span>
                        <input 
                            type="text" 
                            value={pageData.symbol}
                            onChange={onSymbolChange}
                            className={"size-3" + (!pageData.valid ? " invalid" : "") }
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className="details-data">
        <div className={"toolbar"  + (pageData.loading || !pageData.valid ? " disabled" : "")}>
                <PageTabs
                    activeIndex={pageData.tabIndex}
                    tabs={["Covered ITM", "Covered OTM", "Spreads"]}
                    onTabChange={onTabChange}
                    screenMode={app.screenMode}
                />
                <div className="toolbar-filter align-right">
                    {pageData.tabIndex === 2
                    ?null
                    //кнопка showAll
                    //setPageData((prev) => ({...prev, showAllSpreads: !prev.showAllSpreads}))
                    : null
                    }
                    <div className="dropdown">
                        <span>Expiration</span>
                        <div>
                            <button 
                                className="btn" 
                                type="button" 
                                id="Expiration" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                {I.getDateString(pageData.expDate)}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="Expiration">
                                {pageData.expDates.map((date: string, index: number) => (
                                    <li key={index}>
                                        <a 
                                            className={"dropdown-item" + (date === pageData.expDate ? " selected" : "")}
                                            href="/covered" 
                                            onClick={e => onChangeDate(e, date)}
                                        >
                                            {I.getDateString(date)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {pageData.tabIndex === 2
                    ? <div>
                        <input 
                            type="checkbox" 
                            name="switch" 
                            id="switch-r" 
                            className="switch right" 
                            checked={pageData.showAllSpreads} 
                        />
                        <label 
                            htmlFor="switch-r"
                            onClick={e => setPageData((prev) => ({...prev, showAllSpreads: !prev.showAllSpreads}))}
                        >
                            Show negative
                        </label>
                    </div> 

                    :
                    <div className="dropdown">
                        <span>Strike</span>
                        <div>
                            <button className="btn" type="button" id="Expiration" data-bs-toggle="dropdown" aria-expanded="false">
                                {pageData.strike}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="Expiration">
                                {pageData.strikes.map((strike: string, index: number) => (
                                    <li key={index}>
                                        <a 
                                            className={"dropdown-item" + (strike === pageData.strike ? " selected" : "")}
                                            href="/covered" 
                                            onClick={e => onChangeStrike(e, strike)}
                                        >
                                            {strike}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    }

                </div>
            
            </div>
            {pageData.tabIndex === 0
            ?<div className={"table-responsive" + (pageData.loading || !pageData.valid ? " disabled" : "")}>
            <CoveredInTable 
                loading={pageData.loading}
                data={data}
                DrawExpiration={DrawExpiration}
            />
            </div>
            : pageData.tabIndex === 1
            ?<div className={"table-responsive" + (pageData.loading || !pageData.valid ? " disabled" : "")}>
            <CoveredOutTable 
                loading={pageData.loading}
                data={data}
                DrawExpiration={DrawExpiration}
            />
            </div>
            :<div className={pageData.loading || !pageData.valid ? " disabled" : ""}>
                <Spreads 
                    loading={pageData.loading}
                    dataPut={data.put}
                    dataCall={data.call}
                    DrawExpiration={DrawExpiration}
                    showAllSpreads={pageData.showAllSpreads}
                />
            </div>
            }

        </div>

        </>
    )
  }