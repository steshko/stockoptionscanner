import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { PageTabs } from '../../modules/PageTabs'
import * as appActions from '../../store/app/appActions'
import * as I from '../../store/interfaces'
import ByIndexTable from './ByIndexTable'
import MostActiveTable from './MostActiveTable'

export default function MostActive(props: any) {
    const app = useSelector((state: any) => state.app )
    const dispatch = useDispatch()

    useEffect(() => {
        I.storageApp(app)
        // sessionStorage.setItem('app', JSON.stringify(app))
    }, [app])


    const reloadData = useCallback(() => {
        dispatch(appActions.topList(app.topListTab))
    }, [app.topListTab, dispatch])

    useEffect(() => {
        reloadData()
    }, [app.topListTab, reloadData])

    const onTabChange = (event: any, tab: number) => {
        event.preventDefault()
        dispatch(appActions.activeTabChange(tab))
    }


    return (    
    <div>
        <div className="toolbar">
            <PageTabs
                activeIndex={app.topListTab}
                tabs={["Gainers", "Losers", "Active", "Most Volatile", "Large Cap", "Overbought", "Oversold", "By index"]}
                onTabChange={onTabChange}
                screenMode={app.screenMode}
            />
        </div>
        {app.topListTab === 7
        ? <ByIndexTable
            loading={app.topListLoading || app.loading}
            data={app.topList.byIndex}
            reloadData={reloadData}
        />
        :<MostActiveTable
            loading={app.topListLoading || app.loading}
            data={app.topList[I.reportType[app.topListTab]]}
            reloadData={reloadData}
            reportId={app.topListTab}
        />
        }
    </div>

    )
}
