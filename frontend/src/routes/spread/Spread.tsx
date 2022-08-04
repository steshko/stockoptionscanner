import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { DiscountSelect } from '../../modules/DiscountSelect'
import { PageTabs } from '../../modules/PageTabs'
import { PrepareMode } from '../../modules/PrepareMode'
import * as appActions from '../../store/app/appActions'
import * as I from '../../store/interfaces'
import SpreadCallTable from './SpreadCallTable'
import SpreadPutTable from './SpreadPutTable'

export default function Spread(props: any) {
    const app = useSelector((state: any) => state.app )
    const dispatch = useDispatch()

    useEffect(() => {
        I.storageApp(app)
        // sessionStorage.setItem('app', JSON.stringify(app))
    }, [app])


    const reloadData = useCallback(() => {
        if (app.spreadTab === 0) {
            dispatch(appActions.spreadPut(app.expDate, app.spreadDiscount))
        } 
        else if (app.spreadTab === 1) {
            dispatch(appActions.spreadCall(app.expDate, app.spreadDiscount))
        }
    }, [app.spreadTab, app.expDate, app.spreadDiscount, dispatch])

    useEffect(() => {
        reloadData()
    }, [app.spreadTab, app.spreadDiscount, app.expDate, reloadData])

    useEffect(() => {
        if (app.reload) {
            reloadData()
        }
    }, [app.reload, reloadData])

    const onChangeDate = (event: any, date: string) => {
        event.preventDefault()
        dispatch(appActions.setExpDate(date))
    }

    const onChangeDiscount = (event: any, discount: number) => {
        event.preventDefault()
        dispatch(appActions.spreadSetDiscount(discount))
    }

    const onTabChange = (event: any, tab: number) => {
        event.preventDefault()
        dispatch(appActions.spreadTabChange(tab))
    }

    return (    
        <div>
        <div className="toolbar">
            <PageTabs 
                activeIndex={app.spreadTab}
                tabs={["Put spreads", "Call spreads"]}
                onTabChange={onTabChange}
                screenMode={app.screenMode}
            />

            <div className="toolbar-filter align-right">
                <DiscountSelect
                    tabs={app.coveredDiscounts}
                    screenMode={null}
                    onTabChange={onChangeDiscount}
                    value={app.spreadDiscount}
                    label={app.spreadTab === 0 ? "Discount" : "Markup"}
                /> 
                <div className="dropdown">
                    <span>Expiration</span>
                    <div>
                        <button className="btn" type="button" id="Expiration" data-bs-toggle="dropdown" aria-expanded="false">
                            {I.getDateString(app.expDate)}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="Expiration">
                            {app.expDates.map((date: string, index: number) => (
                                <li key={index}>
                                    <a 
                                        className={"dropdown-item" + (date === app.expDate ? " selected" : "")}
                                        href="/spread" 
                                        onClick={e => onChangeDate(e, date)}
                                    >
                                        {I.getDateString(date)}
                                        {/* {date} */}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        {app.prepareMode
        ?<PrepareMode />
        :app.spreadTab === 0
        ? <SpreadPutTable
            loading={app.spreadPutLoading || app.loading}
            data={app.spreadPutData}
            reloadData={reloadData}
        />
        : <SpreadCallTable
            loading={app.spreadCallLoading || app.loading}
            data={app.spreadCallData}
            reloadData={reloadData}
        />
        }
    </div>
    )
}
