import React, { useMemo } from 'react'
import { Column, PanelTable, Order } from '../../modules/panelTable'
import { DrawSymbol, DrawCompany, DrawChange, DrawVolume, DrawMarket } from './tableFunctions'
import DrawEarning from '../../modules/tableCells/DrawEarning'
import DrawDividends from '../../modules/tableCells/DrawDividends'

export default function ByIndexTable(props: any) {

    let defaultOrder: Order = 'up'
    let defaultOrderBy = 6

    const columns: Column[] = useMemo(() =>  [
        {header: 'Symbol', fieldName: 'symbol', sorting: true, onDrawCell: DrawSymbol},
        {header: 'Exch', fieldName: 'exchangeName', sorting: true},
        {header: 'Market', fieldName: 'market', sorting: true, onDrawCell: DrawMarket},
        {header: 'Company', fieldName: 'name', sorting: true, onDrawCell: DrawCompany},
        {header: 'Earning', fieldName: 'earn',  sorting: true, align: 'center', onDrawCell: DrawEarning},
        {header: 'Ex-Div', fieldName: 'div',  sorting: true, align: 'center', onDrawCell: DrawDividends},
        {header: 'Last', align: 'right', fieldName: 'last', sorting: true, toFixed:2},
        {header: 'Change Net/%', width:"180px", align: 'center', fieldName: 'changePercent', sorting: true, onDrawCell: DrawChange},
        {header: 'Volume', align: 'right', fieldName: 'volume', sorting: true, onDrawCell: DrawVolume},
        {header: 'P/E', align: 'right', fieldName: 'PE', sorting: true, toFixed:2},
        // {header: 'EPS', align: 'right', fieldName: 'EPS', sorting: true, toFixed:2},
    ], [])

    return (  
        <PanelTable
            storageKey={"top_by_index"}
            keyField="symbol"
            loading={props.loading}
            columns={columns}
            tableData={props.data}
            defaultOrder={defaultOrder}
            defaultOrderBy={defaultOrderBy}
            // reloadData={props.reloadData}
        />
    )
}
