import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Column, PanelTable } from '../../modules/panelTable'
import * as http from '../../modules/http'
import * as I from '../../store/interfaces'

const initialPageData = {
    eventLoading: false,
    symbolsLoading: false,
    error: '',
    eventLog: [] as any[],
    symbols: [] as any[],
}

export default function AdminPanel(props: any) {
    const [pageData, setPageData] = useState({...initialPageData})


    useEffect (() => {
        (async () => {
            setPageData(prev => ({...prev, eventLoading: true}))
            const result = await http.httpGet(
                '/serverlog',
                {},
                true
            )
            if (result.success) {
                setPageData(prev => ({...prev, eventLoading: false, eventLog: result.data}))

            } else {
                setPageData(prev => ({
                    ...prev, 
                    eventLoading: false, 
                    error: result.data && result.data.message ? result.data.message : result.message
                }))
            }
        })()
    }, [])

    useEffect (() => {
        (async () => {
            setPageData(prev => ({...prev, symbolsLoading: true}))
            const result = await http.httpGet(
                '/symbollog',
                {},
                true
            )
            if (result.success) {
                setPageData(prev => ({...prev, symbolsLoading: false, symbols: result.data}))

            } else {
                setPageData(prev => ({
                    ...prev, 
                    symbolsLoading: false, 
                    error: result.data && result.data.message ? result.data.message : result.message
                }))
            }
        })()
    }, [])



    const DrawDate = (row: any) => {
        const currentDate = new Date()
        const reportDate = new Date(row.date)
        return (
            <>
                {currentDate.getDate() === reportDate.getDate() 
                ? 'today' 
                : reportDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
            </>
        )
    }
    const DrawTime = (row: any) => {
        const date = new Date(row.date)
        return ( <>{date.toLocaleTimeString()}</> )
    }


    const onDrawLastFount = useCallback((row: any) => {
        return (
            <>
                {row.lastFound
                ? I.timeString(new Date(row.lastFound))
                : null
                }
            </>
        )
    }, [])

    const onDrawLastCalc = useCallback((row: any) => {
        return (
            <>
                {row.lastCalc
                ? I.timeString(new Date(row.lastCalc))
                : null
                }
            </>
        )
    }, [])

    const onDrawSymbol = useCallback((row: any) => {
        return (
            <>
                {row.symbol}
                {row.forDelete ? <div>delete</div> : null}
            </>
        )
    }, [])

    const columnsLog: Column[] = useMemo(() =>  [
        {header: 'Event', fieldName: 'event',  sorting: true, align: 'left'},
        {header: 'Date', fieldName: 'date',  sorting: true, align: 'center', onDrawCell: DrawDate},
        {header: 'Time', fieldName: 'date',  sorting: true, align: 'left', onDrawCell: DrawTime},
    ], [])

    const columnsSymbols: Column[] = useMemo(() =>  [
        {header: 'Symbol', fieldName: 'symbol',  sorting: true, align: 'left', onDrawCell: onDrawSymbol},
        {header: 'Discount\\Covered', fieldName: 'maxDiscount', toFixed: 0, width: "4rem",  sorting: true, align: 'right'},
        {header: 'Discount\\Spread', fieldName: 'maxDiscountSpread', toFixed: 0, width: "4rem", sorting: true, align: 'right'},
        {header: 'Found', fieldName: 'lastFound',  sorting: true, align: 'center', onDrawCell: onDrawLastFount},
        {header: 'Calc', fieldName: 'lastCalc',  sorting: true, align: 'center', onDrawCell: onDrawLastCalc},
    ], [onDrawSymbol, onDrawLastFount, onDrawLastCalc])

    return (    
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem"}}>
            <div style={{display: "block"}}>
                <h3>Server events</h3>
                <PanelTable
                    storageKey={"serverEvents"}
                    keyField="_id"
                    loading={pageData.eventLoading}
                    columns={columnsLog}
                    tableData={pageData.eventLog}
                    defaultOrder={"down"}
                    defaultOrderBy={-1}
                />
            </div>
            <div style={{display: "block"}}>
                <h3>Symbols</h3>
                <PanelTable
                    storageKey={"symbolLog"}
                    keyField="_id"
                    loading={pageData.symbolsLoading}
                    columns={columnsSymbols}
                    tableData={pageData.symbols}
                    defaultOrder={"down"}
                    defaultOrderBy={-1}
                />
            </div>
        </div>
    )
}
