import React from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { locale } from '../ui/locale'
import * as authActions from '../store/auth/authActions'
import * as panelActions from '../store/panel/panelActions'
import { Link, useHistory, useLocation} from 'react-router-dom'

export default function Navbar(props: any) {
    const dispatch = useDispatch();
    const history = useHistory()
    const location = useLocation()
    const panelVisible = useSelector( (state: any) => state.panel.show )

    const auth = useSelector((state: any) => state.auth )
    
    const menuOnClick = (event: any, page: string) => {
        event.preventDefault()
        dispatch(panelActions.closePanel())
        history.push(page)
    }

    const signOut = (event: any) => {
        event.preventDefault()
        dispatch(panelActions.closePanel())
        dispatch(authActions.logout())
    }

    return (    
        <nav>
            <div className="logo">
                <Link to="/" onClick={e => menuOnClick(e, "/")}/>
            </div>
            {['/signin', '/forgot', '/signup'].includes(location.pathname)
            ? null
            : <ul>                
                <li className={location.pathname === "/" && !panelVisible ? "active" : ""}>
                    <button onClick={e => menuOnClick(e, "/")}>{locale('menu.home')}</button>
                </li>
                <li className={location.pathname === "/covered" && !panelVisible ? "active" : ""}>
                    <button onClick={e => menuOnClick(e, "/covered")}>{locale('menu.coveredCals')}</button>
                </li>
                <li className={location.pathname === "/spread" && !panelVisible ? "active" : ""}>
                    <button onClick={e => menuOnClick(e, "/spread")}>{locale('menu.spreads')}</button>
                </li>
                <li className={location.pathname === "/active" && !panelVisible ? "active" : ""}>
                    <button onClick={e => menuOnClick(e, "/active")}>{locale('menu.mostActive')}</button>
                </li>
            </ul>
            }
            <div className={"align-right" + (auth.auth ? "" : " btn-group")}>
            {auth.loading
            ? null
            :auth.auth
            ? <div className="dropdown">
                <div>
                    <button className="btn user" type="button" id="user-menu" data-bs-toggle="dropdown" aria-expanded="false">
                        {auth.userName}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="user-menu">
                        {auth.roles.includes("master")
                        ? <li>
                            <a href='/admin' className="dropdown-item" onClick={e => menuOnClick(e, "/admin")}>
                                {locale('menu.admin')}
                            </a>
                        </li>
                        : null
                        }
                        <li>
                            <a href='/settings' className="dropdown-item" onClick={e => menuOnClick(e, "/settings")}>
                                {locale('menu.settings')}
                            </a>
                        </li>
                        <li>
                            <a href='/signout' className="dropdown-item" onClick={signOut}>
                                {locale('menu.signOut')}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            : ['/signin', '/forgot'].includes(location.pathname)
            ? <p>
                {locale('auth.signInStart')} <a 
                    href="/signup" onClick={e => menuOnClick(e, "/signup")}>
                    {locale('auth.signInUrl')}
                </a>
            </p>
            : location.pathname === '/signup'
            ? <p>
                {locale('auth.signUpStart')} <a 
                    href="/signin" onClick={e => menuOnClick(e, "/signin")}>
                    {locale('auth.signUpUrl')}
                </a>
            </p>
            : <>
                <button className="btn text" onClick={e => menuOnClick(e, "/signin")}>{locale('menu.signIn')}</button>
                <button className="btn primary" onClick={e => menuOnClick(e, "/signup")}>{locale('menu.signUp')}</button> 
            </>
            }
            </div>
        </nav>
    )
}
