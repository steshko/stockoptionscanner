import React, { useMemo } from 'react'
import { Column, PanelTable } from '../../modules/panelTable'
import DrawSpreadMid from '../../modules/tableCells/DrawSpreadMid'
import DrawSpreadMin from '../../modules/tableCells/DrawSpreadMin'
import DrawSpreadStrike from '../../modules/tableCells/DrawSpreadStrike'

export default function Spreads(props: any) {

    const putList = useMemo(() => {
        return props.dataPut.filter((item: any) => (item.res > 0 && item.resP > 0) || props.showAllSpreads)
    }, [props.showAllSpreads, props.dataPut])

    const callList = useMemo(() => {
        return props.dataCall.filter((item: any) => (item.res > 0 && item.resP > 0) || props.showAllSpreads)
    }, [props.showAllSpreads, props.dataCall])

    const columnsCall: Column[] = useMemo(() =>  [
        {header: 'Expiration', fieldName: 'expDate',  sorting: true, align: 'left', onDrawCell: props.DrawExpiration},
        {header: 'Strike', fieldName: 'strikeLow',  sorting: true, align: 'center', onDrawCell: DrawSpreadStrike},
        {header: 'By min', fieldName: 'resP',  sorting: true, align: 'right', onDrawCell: DrawSpreadMin},
        {header: 'By mid', fieldName: 'res',  sorting: true, align: 'right', onDrawCell: DrawSpreadMid},
        {header: 'Markup', fieldName: 'discount',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Yeld', fieldName: 'interest',  toFixed: 0, sorting: true, align: 'right'},
    ], [props.DrawExpiration])

    const columnsPut: Column[] = useMemo(() =>  [
        {header: 'Expiration', fieldName: 'expDate',  sorting: true, align: 'left', onDrawCell: props.DrawExpiration},
        {header: 'Strike', fieldName: 'strikeLow',  sorting: true, align: 'center', onDrawCell: DrawSpreadStrike},
        {header: 'By min', fieldName: 'resP',  sorting: true, align: 'right', onDrawCell: DrawSpreadMin},
        {header: 'By mid', fieldName: 'res',  sorting: true, align: 'right', onDrawCell: DrawSpreadMid},
        {header: 'Discount', fieldName: 'discount',  toFixed: 0, sorting: true, align: 'right'},
        {header: 'Yeld', fieldName: 'interest',  toFixed: 0, sorting: true, align: 'right'},
    ], [props.DrawExpiration])

    // console.log('Call', props.dataCall)
    // console.log('Put', props.dataPut)

    return (  
        <div className="table-responsive two-tables">
        {/* //style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem"}}> */}
            <div>
                <h3>Put spreads</h3>
                <PanelTable
                    storageKey={"spreadPutChain"}
                    keyField="_id"
                    loading={props.loading}
                    columns={columnsPut}
                    // tableData={props.dataPut}
                    tableData={putList}
                    defaultOrder={"down"}
                    defaultOrderBy={-1}
                />
            </div>
            <div>
                <h3>Call spreads</h3>
                <PanelTable
                    storageKey={"spreadCallChain"}
                    keyField="_id"
                    loading={props.loading}
                    columns={columnsCall}
                    // tableData={props.dataCall}
                    tableData={callList}
                    defaultOrder={"down"}
                    defaultOrderBy={-1}
                />
            </div>
        </div>
    )
}
