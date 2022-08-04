import React, { useCallback, useEffect } from 'react'
import BestCoveredInTable from './BestCoveredInTable'
import BestSpreadsPutTable from './BestSpreadsPutTable'
import { useDispatch, useSelector} from 'react-redux'
import * as appActions from '../../store/app/appActions'
import TopMoversChart from './TopMoversChart'

export default function Home(props: any) {
    const app = useSelector((state: any) => state.app )
    const dispatch = useDispatch()

    const reloadData = useCallback(() => {
        dispatch(appActions.bestCoveredIn())        
        dispatch(appActions.bestSpreadsPut())     
        dispatch(appActions.moversChart())
    }, [dispatch])

    useEffect(() => {
        reloadData()
    }, [reloadData])

    useEffect(() => {
        if (app.reload) {
            reloadData()
        }
    }, [app.reload, reloadData])

    let topListNsdqG:[] = []
    let topListNsdqL:[] = []
    let topListNyG:[] = []
    let topListNyL:[] = []

    if (app.moversChart.gainers?.length > 0 && app.moversChart.losers?.length > 0) {
        topListNsdqG = app.moversChart.gainers.filter( (el:any) => el.code === 'NASDAQ')
        topListNsdqL = app.moversChart.losers.filter( (el:any) => el.code === 'NASDAQ')
        topListNyG = app.moversChart.gainers.filter( (el:any) => el.code === 'NYSE')
        topListNyL = app.moversChart.losers.filter( (el:any) => el.code === 'NYSE')

        topListNsdqG.sort( (a:any, b: any) => a.changePercent < b.changePercent ? 1 : -1 )
        topListNsdqL.sort( (a:any, b: any) => a.changePercent > b.changePercent ? 1 : -1 )
        topListNyG.sort( (a:any, b: any) => a.changePercent < b.changePercent ? 1 : -1 )
        topListNyL.sort( (a:any, b: any) => a.changePercent > b.changePercent ? 1 : -1 )
    }

    return (    
        <div>
            <h2>Best covered deals</h2>
            <BestCoveredInTable 
                loading={app.coveredInLoading || app.loading}
                // loading={true}
                data={app.bestCallData}
            />
            <h2>Best put spreads</h2>
            <BestSpreadsPutTable 
                loading={app.bestSpreadPutLoading || app.loading}
                data={app.bestSpreadPutData}
            />
            <h2>NYSE</h2>
            <TopMoversChart 
                loading={false}
                gainers={topListNsdqG}
                losers={topListNsdqL}
            />
            <h2>NASDAQ</h2>
            <TopMoversChart 
                loading={false}
                gainers={topListNyG}
                losers={topListNyL}
            />

        </div>

    )
}
