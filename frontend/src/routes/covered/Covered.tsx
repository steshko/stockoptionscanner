import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import * as appActions from '../../store/app/appActions'
import CoveredInTable from './CoveredInTable'
import CoveredOutTable from './CoveredOutTable'
import * as I from '../../store/interfaces'
import { PageTabs } from '../../modules/PageTabs'
import { DiscountSelect } from '../../modules/DiscountSelect'
import { PrepareMode } from '../../modules/PrepareMode'

export default function Covered(props: any) {
    const app = useSelector((state: any) => state.app )
    const dispatch = useDispatch()


    useEffect(() => {
        I.storageApp(app)
    }, [app])


    const reloadData = useCallback(() => {
        if (app.coveredTab === 0) {
            dispatch(appActions.coveredIn(app.expDate, app.coveredDiscount))
        } else if (app.coveredTab === 1) {
            dispatch(appActions.coveredOut(app.expDate, app.coveredStrike))
        }
    }, [app.coveredTab, app.expDate, app.coveredDiscount, app.coveredStrike, dispatch])

    useEffect(() => {
        reloadData()
    }, [app.coveredTab, app.coveredDiscount, app.expDate, reloadData])

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
        dispatch(appActions.coveredSetDiscount(discount))
    }

    const onChangeStrike = (event: any, strike: number) => {
        event.preventDefault()
        dispatch(appActions.coveredSetStrike(strike))
    }

    const onTabChange = (event: any, tab: number) => {
        event.preventDefault()
        dispatch(appActions.coveredTabChange(tab))
    }

    return (    
    
    <div>
        <div className="toolbar">
            <PageTabs 
                activeIndex={app.coveredTab}
                tabs={["In the money", "Out of the money"]}
                onTabChange={onTabChange}
                screenMode={app.screenMode}
            />
            <div className="toolbar-filter align-right">
                {app.coveredTab === 0
                ? <DiscountSelect 
                    tabs={app.coveredDiscounts}
                    screenMode={null}
                    onTabChange={onChangeDiscount}
                    value={app.coveredDiscount}
                    label="Discount"
                />
                : <div className="dropdown">
                <span>Strike</span>
                <div>
                    <button className="btn" type="button" id="Strike" data-bs-toggle="dropdown" aria-expanded="false">
                    {app.coveredStrikes[app.coveredStrike - 1]}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="Strike">
                        {app.coveredStrikes.map((strike: string, index: number) => (
                            <li key={index}>
                                <a 
                                    className={"dropdown-item" + (index + 1 === app.coveredStrike ? " selected" : "")}
                                    href="/covered"
                                    onClick={e => onChangeStrike(e, index + 1)}
                                >
                                    {strike}
                                </a>
                            </li>    
                        ))}
                    </ul>
                </div>
            </div>
                }
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
                                        href="/covered" 
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
        :app.coveredTab === 0
        ?<CoveredInTable 
            loading={app.coveredInLoading || app.loading}
            // loading={true}
            data={app.coveredInData}
            reloadData={reloadData}
        />
        :<CoveredOutTable 
            loading={app.coveredOutLoading || app.loading}
            data={app.coveredOutData}
            reloadData={reloadData}
        />
        }
    </div>

    )
}
