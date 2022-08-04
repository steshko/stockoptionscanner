export const SCREEN_MODE_MOBILE = 768
export const SCREEN_MODE_IPAD = 1120

export const colors = [
    "default",
    "sunset",
    "orange",
    "yellow",
    "sunny",
    "lime",
    "salad",
    "lightgreen",
    "aquamarin",
    "sky",
    "blue",
    "oxford",
    "magenta",
    "pink",
]
export const sectors = [ 
    'Basic Materials',
    'Communication Services',
    'Consumer Cyclical',
    'Consumer Defensive',
    'Energy',
    'Financial',
    'Financial Services',
    'Healthcare',
    'Industrial Goods',
    'Industrials',
    'Real Estate',
    'Services',
    'Technology',
    'Utilities'    
]

export const reportType = [ 'gainers', 'losers', 'active', 'most-volatile', 'large-cap', 'overbought', 'oversold', 'byIndex' ]

const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]

export function storageApp(app: App) {
    sessionStorage.setItem('app', JSON.stringify({
        coveredDiscount: app.coveredDiscount,
        coveredStrike: app.coveredStrike,
        coveredTab: app.coveredTab,
        expDate: app.expDate,
        spreadDiscount: app.spreadDiscount,
        spreadTab: app.spreadTab,
        topListTab: app.topListTab
    }))
}

export const getDateString = (dateString: string) => {

    if (dateString === 'Any date') return dateString
    return  monthNames[parseInt(dateString.slice(5, 7))-1] + ' ' + 
            dateString.slice(8, 10) + ', ' + 
            dateString.slice(0, 4) + 
            dateString.slice(10)
}
export function timeString(date: Date): string {
    var currentDate = new Date()
    currentDate.setDate(currentDate.getDate() )

    var timeDiff = Math.abs(date.getTime() - currentDate.getTime())
    let days = Math.floor((timeDiff % 2073600000) / 3600000 /24);
    let hours = Math.floor((timeDiff % 86400000) / 3600000);
    let minutes = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
    return (
        (days > 1 ? days +  ' days ' : '') + 
        (days === 1 ? days +  ' day ' : '') + 
        (hours > 0 && days < 2 ? hours +  ' h. ' : '') + 
        (minutes > 0 && days === 0 ? minutes + ' min.' : '') + 
        (minutes === 0 && hours === 0 && days === 0? 'less then 1 min.' : '') 
    )
}

export interface App {
    offlineMode: boolean,
    prepareMode: boolean,
    loading: boolean,
    reload: boolean,
    screenMode: 'mobile' | 'ipad' | null,

    calcYield: number,
    marginInterest: number,

    coveredDiscount: number,
    coveredDiscounts: number[],
    coveredStrike: number,
    coveredStrikes: string[],
    coveredTab: number,
    expDate: string,
    expDates: string[]

    coveredInData: CoveredIn[],
    coveredInLoading: boolean,

    coveredOutData: CoveredOut[],
    coveredOutLoading: boolean,

    spreadDiscount: number,
    spreadDiscounts: number[],
    spreadTab: number,

    spreadPutData: SpreadPut[],
    spreadPutLoading: boolean,
    spreadCallData: SpreadCall[],
    spreadCallLoading: boolean,

    earningListData: earningList[],
    earningListDataLoading: boolean,
    
    dividendListData: dividendList[],
    dividendListDataLoading: boolean,

    bestCallData: CoveredIn[],
    bestCallLoading: boolean,

    bestSpreadPutData: SpreadPut[],
    bestSpreadPutLoading: boolean,

    topListTab: number,
    topListLoading: boolean,
    topList: {
        gainers: topList[],
        losers: topList[],
        active: topList[],
        "most-volatile": topList[],
        "large-cap": topList[],
        overbought: topList[],
        oversold: topList[],
        byIndex: topList[],
    },
    moversChartLoading: boolean,
    moversChart: {gainers: any[], losers: any[]}
}

export interface Auth {
    auth: boolean | null,
    loading: boolean,

    userId: string | null,
    userName: string | null,
    email: string | null,
    roles: string[],

    industryColor: { industry: string, color: string }[],
    calcYield: number,
    minStockPrice: number,
    maxStockPrice: number,
    marginInterest: number,

    passwordChanged: boolean,
    emailVerified: boolean,
    error: string | null,
}

export interface CoveredInData {
    loading: boolean,
    valid: boolean,
    list: CoveredIn[]
}

export interface CoveredIn {
    symbol: string,
    expDate: string,
    daysToExp: number,

    strikePrice: number,
    strikeNum: number,
    earn: Date | null,

    bid: number,
    ask: number,
    mid: number,
    netDebitBid: number,
    netDebitAsk: number,
    netDebitMid: number,
    underPrice: number,
    change: number,
    percentChange: number,

    interest: number,
    discount: number,
    calcMargineInt: number,
    calc: number,

    updatedAt: string
}

export interface CoveredOut {
    symbol: string,
    expDate: string,
    daysToExp: number,

    strikePrice: number,
    strikeNum: number,

    bid: number,
    ask: number,
    mid: number,
    netDebitBid: number,
    netDebitAsk: number,
    netDebitMid: number,
    underPrice: number,
    change: number,
    percentChange: number,
    
    yeld: number,
    interest: number,
    discount: number,
    calcMargineInt: number,
    calc: number,

    updatedAt: string
}

export interface SpreadPut {
    symbol: string,
    expDate: string,
    daysToExp: number,

    strikeLow: number,
    strikeHight: number,
    strikeNum: number,

    lowBid: number,
    lowAsk: number,
    hightBid: number,
    hightAsk: number,


    underPrice: number,
    change: number,
    percentChange: number,
    
    interest: number,
    discount: number,
    res: number,
    resP: number,
    calcMargineInt: number,
    calc: number,

    updatedAt: string
}

export interface SpreadCall {
    symbol: string,
    expDate: string,
    daysToExp: number,

    strikeLow: number,
    strikeHight: number,
    strikeNum: number,

    lowBid: number,
    lowAsk: number,
    hightBid: number,
    hightAsk: number,


    underPrice: number,
    change: number,
    percentChange: number,
    
    interest: number,
    discount: number,
    res: number,
    resP: number,
    calcMargineInt: number,
    calc: number,

    updatedAt: string
}

export interface topList {
    code: string,
    name: string,
    type: string,
    sector: string,

    symbol: string,
    last: number,
    changePercent: number,
    change: number,
    vol: number,
    mktCap: number,
    employees: number,
    PE: number,
    EPS: number,
}

export interface earningList {
    _id: string,
    symbol: string,
    date: Date,
    time: string,
    estimate: number,
}

export interface dividendList {
    _id: string,
    symbol: string,
    exDivDate: Date,
    payDate: Date,
    amount: number,
}