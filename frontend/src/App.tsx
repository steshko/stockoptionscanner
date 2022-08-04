import React, { useEffect } from 'react'

import {useDispatch} from 'react-redux'
import { token } from './store/auth/authActions'
import * as appActions from './store/app/appActions'
import {BrowserRouter,  } from 'react-router-dom'
import Routes from './routes/Routes'
import Navbar from './routes/Navbar'
import Footer from './routes/Footer';
import ItemPanel from './routes/ItemPanel/ItemPanel'

// import './style/css/cc.css'


function App() {
    const dispatch = useDispatch();
    // const itemPanel = useSelector( (state: any) => state.panel )

    useEffect( () => {
        dispatch(appActions.loadDates())
        dispatch(appActions.dividends())
        dispatch(appActions.ernings())
        dispatch(token())
    })

    return (
        <BrowserRouter>
            <Navbar/>
            <section className="main">
                <Routes />
                <Footer />
            </section>
            <ItemPanel
                // show={itemPanel.show}
                // symbol={itemPanel.symbol}
            />
        </BrowserRouter>
    )
}

export default App
