import React, { useMemo } from 'react'
import { Column, PanelTable } from '../../modules/panelTable'
import DrawSymbol from '../../modules/tableCells/DrawSymbol'
import DrawCompany from '../../modules/tableCells/DrawCompany'
import DrawLastPrice from '../../modules/tableCells/DrawLastPrice'
import DrawStrike from '../../modules/tableCells/DrawStrike'
import DrawNetDebitMid from '../../modules/tableCells/DrawNetDebitMid'
import DrawExpiration from '../../modules/tableCells/DrawExpiration'
import DrawEarning from '../../modules/tableCells/DrawEarning'
import DrawDividends from '../../modules/tableCells/DrawDividends'

export default function BestCoveredInTable(props: any) {


    // const data: any[] = []

    const columns: Column[] = useMemo(() =>  [
        {header: 'Symbol', fieldName: 'symbol',  sorting: true, align: 'left', minWidth: "7rem", onDrawCell: DrawSymbol},
        {header: 'Company', fieldName: 'companyName',  sorting: true, align: 'left', onDrawCell: DrawCompany},
        {header: 'Expiration', fieldName: 'expDate',  sorting: true, align: 'left', onDrawCell: DrawExpiration},
        {header: 'Earning', fieldName: 'earn',  sorting: true, align: 'center', onDrawCell: DrawEarning},
        {header: 'Ex-Div', fieldName: 'div',  sorting: true, align: 'center', onDrawCell: DrawDividends},
        {header: 'Last', fieldName: 'underPrice',  sorting: true, align: 'center', onDrawCell: DrawLastPrice},
        {header: 'strike', fieldName: 'strikePrice',  sorting: true, align: 'center', onDrawCell: DrawStrike},

        {header: 'Covered call price\\Bid', fieldName: 'netDebitBid',  sorting: true, align: 'right'},
        {header: 'Covered call price\\Ask', fieldName: 'netDebitAsk',  sorting: true, align: 'right'},
        {header: 'Covered call price\\Mid', fieldName: 'netDebitMid',  sorting: true, align: 'right', onDrawCell: DrawNetDebitMid},
        {header: 'Discount', fieldName: 'discount',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Yeld', fieldName: 'interest',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Calc', fieldName: 'calc',  sorting: true, align: 'right', },
    ], [])

    return (  
        <PanelTable
            storageKey={"bestCoveredIn"}
            keyField="_id"
            loading={props.loading}
            columns={columns}
            tableData={props.data}
            defaultOrder={"down"}
            defaultOrderBy={-1}
            // reloadData={props.reloadData}
    
        />
    )
}
