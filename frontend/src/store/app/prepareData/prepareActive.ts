import * as I from '../../interfaces'
// import {useSelector} from 'react-redux'


export function prepareActive(data: I.topList[]): I.topList[] {
    // const list = useSelector((state: any) => state.app.earningListData )

    data.forEach(row => {
        if ( ['Health Services', 'Health Technology'].includes(row.sector) ) {
            row.sector = 'Healthcare'
        }
    })
    return data
}