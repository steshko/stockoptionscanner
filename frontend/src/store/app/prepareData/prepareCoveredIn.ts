import * as I from '../../interfaces'
// import {useSelector} from 'react-redux'


export function prepareCoveredIn(data: I.CoveredIn[], marginInterest: number, calcYield: number): I.CoveredIn[] {
    // const list = useSelector((state: any) => state.app.earningListData )

    data.forEach(row => {
        // let earn: Date | null = null
        // const index =  list ? list.findIndex((item: any) => item.symbol === row.symbol) : -1
        // if (index >= 0) {
        //     earn = (new Date(list[index].date))
        // }
        const margin = (row.strikePrice * (marginInterest/100) /365 * (row.daysToExp + 5))

        row.interest = ((row.strikePrice - row.netDebitMid - margin)/row.netDebitMid*365/(row.daysToExp+3)*100)
        row.calcMargineInt = margin
        row.calc = Math.floor((365*100* (row.strikePrice - row.calcMargineInt)/(calcYield * (row.daysToExp + 3) + 365 * 100))*100)/100

        // row.earn = earn
    })
    return data
}