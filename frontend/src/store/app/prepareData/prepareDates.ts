
export function prepareDates(data: any, earningList: any, divList: any) {

    data.forEach((row: any) => {
        const earningIndex =  earningList ? earningList.findIndex((item: any) => item.symbol === row.symbol) : -1
        if (earningIndex >= 0) {
            row.earn = new Date(earningList[earningIndex].date) 
            row.earnTime = earningList[earningIndex].time === "--" ? null : earningList[earningIndex].time
        } else {
            row.earn = null
        }

        const divIndex =  divList ? divList.findIndex((item: any) => item.symbol === row.symbol) : -1
        if (divIndex >= 0) {
            row.div = new Date(divList[divIndex].exDivDate) 
        } else {
            row.div = null
        }
    })
}