import * as I from '../../interfaces'


export function prepareSpreadCall(data: I.SpreadCall[], marginInterest: number, calcYield: number): I.SpreadCall[] {

    data.forEach(row => {
        row.calc = ((row.strikeHight - row.strikeLow ) - 365 *100* (row.strikeHight - row.strikeLow )/(calcYield * (row.daysToExp + 3) + 365 * 100))
    //     const margin = ((row.underPrice - row.mid) * (marginInterest/100) /365 * (row.daysToExp + 5))
        
    //     row.yeld = (row.mid / row.underPrice * 100)
    //     row.interest = (row.mid - margin) / row.underPrice * 365 / row.daysToExp * 100
    //     row.calcMargineInt = margin
    })
    return data
}