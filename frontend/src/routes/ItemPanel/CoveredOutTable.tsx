import React, { useMemo } from 'react'
import { Column, PanelTable } from '../../modules/panelTable'
import DrawStrike from '../../modules/tableCells/DrawStrike'
import DrawMid from '../../modules/tableCells/DrawMid'

export default function CoveredOutTable(props: any) {


    // const data: any[] = []

    const columns: Column[] = useMemo(() =>  [
        {header: 'Expiration', fieldName: 'expDate',  sorting: true, align: 'left', onDrawCell: props.DrawExpiration},
        {header: 'Strike', fieldName: 'strikePrice',  sorting: true, align: 'center', onDrawCell: DrawStrike},
        {header: 'Option price\\Bid', fieldName: 'bid',  toFixed: 2, sorting: true, align: 'right'},
        {header: 'Option price\\Ask', fieldName: 'ask',  toFixed: 2, sorting: true, align: 'right'},
        {header: 'Option price\\Mid', fieldName: 'mid',  toFixed: 2, sorting: true, align: 'right', onDrawCell: DrawMid},
        {header: 'Yeld (%)', fieldName: 'yeld',  toFixed: 2, sorting: true, align: 'right'},
        {header: 'Yeld (%p.a.)', fieldName: 'interest',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Calc', fieldName: 'calc',  toFixed: 2,  sorting: true, align: 'right', },
    ], [props.DrawExpiration])

    return (  
        <PanelTable
            storageKey={"coveredOutChain"}
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
