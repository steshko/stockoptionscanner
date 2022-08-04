import React, { useMemo } from 'react'
import { Column, PanelTable } from '../../modules/panelTable'
import DrawSymbol from '../../modules/tableCells/DrawSymbol'
import DrawCompany from '../../modules/tableCells/DrawCompany'
import DrawLastPrice from '../../modules/tableCells/DrawLastPrice'
import DrawStrike from '../../modules/tableCells/DrawStrike'
import DrawBidAsk from '../../modules/tableCells/DrawBidAsk'
import DrawNetDebitMid from '../../modules/tableCells/DrawNetDebitMid'
import DrawEarning from '../../modules/tableCells/DrawEarning'
import DrawDividends from '../../modules/tableCells/DrawDividends'

export default function CoveredInTable(props: any) {


    // const data: any[] = []

    const columns: Column[] = useMemo(() =>  [
        {header: 'Symbol', fieldName: 'symbol',  sorting: true, align: 'left', minWidth: "7rem", onDrawCell: DrawSymbol},
        {header: 'Company', fieldName: 'companyName',  sorting: true, align: 'left', onDrawCell: DrawCompany},
        {header: 'Earning', fieldName: 'earn',  sorting: true, align: 'center', onDrawCell: DrawEarning},
        {header: 'Ex-Div', fieldName: 'div',  sorting: true, align: 'center', onDrawCell: DrawDividends},
        {header: 'Last', fieldName: 'underPrice',  sorting: true, align: 'center', onDrawCell: DrawLastPrice},
        {header: 'strike', fieldName: 'strikePrice',  sorting: true, align: 'center', onDrawCell: DrawStrike},
        {header: 'Call price', fieldName: '',  sorting: false, align: 'center', onDrawCell: DrawBidAsk},

        {header: 'Covered call price\\Bid', fieldName: 'netDebitBid',  sorting: true, align: 'right'},
        {header: 'Covered call price\\Ask', fieldName: 'netDebitAsk',  sorting: true, align: 'right'},
        {header: 'Covered call price\\Mid', fieldName: 'netDebitMid',  sorting: true, align: 'right', onDrawCell: DrawNetDebitMid},
        {header: 'Discount', fieldName: 'discount',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Yeld', fieldName: 'interest',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Calc', fieldName: 'calc',  sorting: true, align: 'right', },
    ], [])

    return (  
        <PanelTable
            storageKey={"coveredIn"}
            keyField="_id"
            loading={props.loading}
            columns={columns}
            tableData={props.data}
            defaultOrder={"down"}
            defaultOrderBy={-1}
            // reloadData={props.reloadData}

            // onCellCssClass?: (row:any, header: string) => string,
    
        />
    )
}
