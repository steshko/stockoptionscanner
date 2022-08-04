import React, { useMemo } from 'react';


export type Order = 'down' | 'up'
export type Align = 'left' | 'right' | 'center'

export interface Column {
    header: string,
    align?: Align, 
    fieldName: string,
    sorting?: boolean,
    width?: string | null,
    toFixed?: number,
    minWidth?: string,
    onDrawCell?: React.FC
}
export interface TableProps {
    storageKey: string,
    keyField: string | null,
    loading?: boolean,
    columns: Column[],
    tableData: any[],
    defaultOrder?: Order,
    defaultOrderBy?: number,
    // reloadData?: () => void,
    onCellCssClass?: (row:any, header: string) => string,
}

interface headerCell {
    index: number,
    header: string,
    rowspan: number,
    colspan: number
}
type headerRow = headerCell[];


function DrawTableHead(props: any) {
    const { headerRows, columns, onRequestSort, order, orderBy } = props

    const onClick = (event: any, index: number, colspan: number) => {
        if (colspan < 2 && columns[index].sorting) {
            onRequestSort(event, index)
        }
    }

    return (
        <thead>
           {headerRows.map( (headerRow:headerRow, rowIndex: number) => (

            <tr key={rowIndex}>
                {headerRow.map((headCell: headerCell, index: number) => (
                <th
                    key={index}
                    className={
                        headCell.colspan > 1
                        ? "align-center"
                        : (columns[headCell.index].sorting ? "sort " : "") +
                        (orderBy === headCell.index ? " " + order : "") +
                        (columns[headCell.index].align ? " align-" + columns[headCell.index].align : "") 
                    }
                    style={{
                        minWidth: columns[headCell.index].minWidth && headCell.colspan <= 1
                        ? columns[headCell.index].minWidth 
                        : "",
                        width: columns[headCell.index].width && headCell.colspan <= 1
                        ? columns[headCell.index].width 
                        : "",
                    }}
                    rowSpan={headCell.rowspan}
                    colSpan={headCell.colspan}
                    onClick={(event) => onClick(event, headCell.index, headCell.colspan)}
                > 
                    {headCell.header}
                </th>
                ))}
            </tr>

            ))
            }

        </thead>
    )
}    

function DrawTableRow(props: any){
    const { rowKey, row, columns, onCellCssClass, orderBy } = props
    return (
        <tr key={rowKey} className="onclick">
        {columns.map( (col: Column, index: number) => {
            let value = row[col.fieldName]
            
            return(
                <td 
                    key={index} 
                    className={
                        (col.align ? " align-" + col.align : "") +
                        (orderBy === index ? " sorted" : "") +
                        (onCellCssClass ? onCellCssClass(row, col.header) : "")
                    }
                >
                    {col.onDrawCell 
                    ? col.onDrawCell(row, col.header)
                    : value === null || value === undefined
                    ? null
                    : col.toFixed !== undefined ? value.toFixed(col.toFixed) : value
                    // : value ? value.toFixed(0) : null
                    }
                </td>
            )
        })}
        </tr>
    )
}    


export function PanelTable(props: TableProps) {
    const {
        storageKey, keyField, columns, tableData, defaultOrder, 
        defaultOrderBy, onCellCssClass, loading } = props

    const startSort = useMemo(() => {
        if (keyField) {
            return tableData.filter((row: any) => row[keyField]).map((row: any) => row[keyField])
        } else {
            return []
        }
    }, [tableData, keyField])


    const fromStorage = sessionStorage.getItem(storageKey)
    let _defaultOrder = fromStorage ? JSON.parse(fromStorage).defaultOrder : defaultOrder
    let _defaultOrderBy = fromStorage ? JSON.parse(fromStorage).defaultOrderBy : defaultOrderBy
    if (columns.length <= _defaultOrderBy) _defaultOrderBy = defaultOrderBy

    const [order, setOrder] = React.useState<Order>(_defaultOrder);
    const [orderBy, setOrderBy] = React.useState(_defaultOrderBy);

    if (order !== _defaultOrder) setOrder(_defaultOrder)
    if (orderBy !== _defaultOrderBy) setOrderBy(_defaultOrderBy)


    // function tableDataSort(tableData: any[], columns: Column[], order: Order, orderBy: number): any[] {
    function tableDataSort(): any[] {
        if (orderBy < 0 && keyField) {
            return tableData.sort((a: any, b: any) => startSort.indexOf(a[keyField]) - startSort.indexOf(b[keyField]))
        }
        else if (orderBy >= 0 && orderBy < columns.length && columns[orderBy].sorting) {
    
            const comparator = order === 'down' ? 1 : -1
            const sortField : string = columns[orderBy].fieldName
        
            tableData.sort((a: any, b: any) => {
                if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
                    return a[sortField] > b[sortField] ? comparator : -comparator
                }
                if (!!a[sortField] && !b[sortField]) return -1
                if (!a[sortField] && !!b[sortField]) return 1
    
                if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
                    return a[sortField].toUpperCase() > b[sortField].toUpperCase() ? comparator : -comparator
                } else {
                    return a[sortField] > b[sortField] ? comparator : -comparator
                }
            })
        }
        return tableData
    }

    function handleRequestSort (event: React.MouseEvent<unknown>, index: number) {
        if (order === 'up' && orderBy === index) {
            setOrder('down');
            setOrderBy(-1);
            sessionStorage.setItem(storageKey, JSON.stringify({defaultOrder: 'down', defaultOrderBy: -1}))  
        } else {
            const isAsc = orderBy === index && order === 'down'
            setOrder(isAsc ? 'up' : 'down');
            setOrderBy(index);
            sessionStorage.setItem(storageKey, JSON.stringify({defaultOrder: isAsc ? 'up' : 'down', defaultOrderBy: index}))
        }
    }

    const columnsQty = columns.length

    const headerRows: headerRow[] = useMemo(() => {
        const hr: headerRow[] = [] 
        const h: {index: number, arr:string[]}[] = [] 

        columns.forEach( (el, index) => {
            h.push({index: index, arr: el.header.split('\\')})
        })

        const maxRows = h.reduce((a, b) => a.arr.length > b.arr.length ? a : b).arr.length;
        for (let level=0; level < maxRows; level++) {
            hr.push(
                h
                .filter( (el, index, arr) => (el.arr.length > level))
                .map( (el, index, h) => {
                    let colspan = 0
                    for (let i=index; i<h.length; i++) { 
                        if (h[i].arr[level] === el.arr[level]) colspan++
                    }
                    return ({
                    index: el.index, 
                    header: el.arr[level], 
                    colspan: colspan, 
                    rowspan: el.arr.length > 1 ? 1 : maxRows - level
                    
                })})
                .filter( (el, index, arr) => (arr.findIndex( v => v.header === el.header) === index))
            )
        }
        return hr
    }, [columns])

    return (

    <div className="table-responsive">
          <table>
            <DrawTableHead
                columns={columns}
                headerRows={headerRows}
                onRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
            />
            <tbody>
                <tr key='loading'>
                    <td key="1" colSpan={columnsQty} className="table-loading">
                        <div className={loading ? "linear-activity" : ""}>
                            <div className="indeterminate">
                            </div>
                        </div>
                    </td>
                    {/* <td className={loading ? "table-loading" : ""} colSpan={columnsQty} key="1"></td> */}
                </tr>
                {!tableData
                ?null
                :tableData.length === 0
                ?<tr key='no_data'>
                        <td align="center" colSpan={columnsQty} key="2">
                           {loading ? "loading data..." : "No data"}
                        </td>
                </tr>
                :tableDataSort() //tableDataSort(tableData, columns, order, orderBy)
                .map((row, index) => {
                    return (
                        <DrawTableRow 
                            key={index}
                            index={index}
                            rowKey={keyField ? row[keyField] : index}
                            row={row}
                            columns={columns}
                            onCellCssClass={onCellCssClass}
                            loading={loading} 
                            orderBy={orderBy}
                        />  
                    )
                })}
            </tbody>
          </table>
    </div>
  );
}
