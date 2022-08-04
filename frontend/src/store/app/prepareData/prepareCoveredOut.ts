import * as I from '../../interfaces'


export function prepareCoveredOut(data: I.CoveredOut[], marginInterest: number, calcYield: number): I.CoveredOut[] {

    data.forEach(row => {
        const margin = ((row.underPrice - row.mid) * (marginInterest/100) /365 * (row.daysToExp + 5))
        
        row.yeld = (row.mid / row.underPrice * 100)
        row.interest = (row.mid - margin) / row.underPrice * 365 / row.daysToExp * 100
        row.calcMargineInt = margin
    })
    return data
}