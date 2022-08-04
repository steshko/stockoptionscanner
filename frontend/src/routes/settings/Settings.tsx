import {useMemo} from 'react'
import * as I from '../../store/interfaces'
import { useDispatch, useSelector} from 'react-redux'
import * as authActions from '../../store/auth/authActions'

export const Settings = () => {
    const industryColor = useSelector((state: any) => state.auth.industryColor )
    const dispatch = useDispatch()

    const industryData = useMemo(() => {
        return I.sectors.map(sector => {
            const index = industryColor.findIndex((color: any) => color.industry === sector)
            return ({
                sector: sector,
                color: index >= 0 ? industryColor[index].color : "default"
            })
        })
    }, [industryColor])

    const onChangeColor = (e: any, sector: string, color: string) => {
        e.preventDefault()
        dispatch(authActions.changeIndustryColor(sector, color))
    }

    return (
        <div>
        <div className="from">
            <h1>Data Settings</h1>
            <form>
                <div>
                    <h5>Stock price greater/less then</h5>
                    
                </div>

                <h5>Colors for the business sector</h5>
                <div className="color-selection">
                {industryData.map(industry => (
                    <div className="dropdown">

                        <div>
                            <button 
                                className={"btn palette-" + industry.color}
                                type="button" 
                                id="user-menu" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                {industry.sector}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="user-menu">
                                {I.colors.map(color => (
                                    <li>
                                        <a 
                                            className={
                                                "palette-" + color + 
                                                (color === industry.color ? " selected" :  "")
                                            } 
                                            href="#"
                                            onClick={e => onChangeColor(e, industry.sector, color)}
                                        >
                                        </a>
                                    </li>
                                ))

                                }
                            </ul>
                        </div>
                    </div>
                ))

                }

                </div>
            </form>
        </div>
        </div>
    )
}