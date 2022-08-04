import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { rootReducer } from './store/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

export const BACKENDROOT = '/api'
export const STORAGE_AUTH: string = 'token'

export const store = createStore(rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

const app = (
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider> 
)

ReactDOM.render(app, document.getElementById('root'));
