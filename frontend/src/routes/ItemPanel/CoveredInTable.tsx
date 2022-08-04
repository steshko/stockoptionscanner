import React, { useMemo } from 'react'
import { Column, PanelTable } from '../../modules/panelTable'
import DrawStrike from '../../modules/tableCells/DrawStrike'
import DrawNetDebitMid from '../../modules/tableCells/DrawNetDebitMid'

export default function CoveredInTable(props: any) {

    const columns: Column[] = useMemo(() => [
        {header: 'Expiration', fieldName: 'expDate',  sorting: true, align: 'left', onDrawCell: props.DrawExpiration},
        {header: 'Strike', fieldName: 'strikePrice',  sorting: true, align: 'center', onDrawCell: DrawStrike},
        {header: 'Covered call price\\Bid', fieldName: 'netDebitBid',  sorting: true, align: 'right'},
        {header: 'Covered call price\\Ask', fieldName: 'netDebitAsk',  sorting: true, align: 'right'},
        {header: 'Covered call price\\Mid', fieldName: 'netDebitMid',  sorting: true, align: 'right', onDrawCell: DrawNetDebitMid},
        {header: 'Discount', fieldName: 'discount',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Yeld (%p.a.)', fieldName: 'interest',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Calc', fieldName: 'calc',  sorting: false, align: 'right', },
    ], [props.DrawExpiration])

    return (  
        <PanelTable
            storageKey={"coveredInChain"}
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
