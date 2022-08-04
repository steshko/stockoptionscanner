import React, { useMemo } from 'react'
import { Column, PanelTable } from '../../modules/panelTable'
import DrawSymbol from '../../modules/tableCells/DrawSymbol'
import DrawCompany from '../../modules/tableCells/DrawCompany'
import DrawLastPrice from '../../modules/tableCells/DrawLastPrice'
import DrawEarning from '../../modules/tableCells/DrawEarning'
import DrawDividends from '../../modules/tableCells/DrawDividends'
import DrawSpreadStrike from '../../modules/tableCells/DrawSpreadStrike'
import DrawOptionMid from '../../modules/tableCells/DrawOptionMid'

export default function SpreadCallTable(props: any) {

    const columns: Column[] = useMemo(() =>  [
        {header: 'Symbol', fieldName: 'symbol',  sorting: true, align: 'center', onDrawCell: DrawSymbol},
        {header: 'Company', fieldName: '',  sorting: true, align: 'left', onDrawCell: DrawCompany},
        {header: 'Earning', fieldName: 'earn',  sorting: true, align: 'center', onDrawCell: DrawEarning},
        {header: 'Ex-Div', fieldName: 'div',  sorting: true, align: 'center', onDrawCell: DrawDividends},
        {header: 'Last', fieldName: 'underPrice',  sorting: true, align: 'center', disablePadding: true, onDrawCell: DrawLastPrice},
        {header: 'Strike', fieldName: '',  sorting: true, align: 'center', disablePadding: true, onDrawCell: DrawSpreadStrike},
        {header: 'Markup', fieldName: 'discount',  sorting: true, toFixed:0, align: 'center', disablePadding: true},
        {header: 'By min', fieldName: 'resP', sorting: true, toFixed:2, align: 'center'},
        {header: 'By mid', fieldName: 'res', sorting: true,toFixed:2, align: 'center', onDrawCell: DrawOptionMid},
        {header: 'Yeld', fieldName: 'interest',  sorting: true, toFixed: 0, align: 'right'},
        {header: 'Calc', fieldName: 'calc',  sorting: true, toFixed: 2, align: 'right'},
    ], [])

    return (  
        <PanelTable
            storageKey={"spreadPut"}
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
