import React, { useState } from 'react'
import { useSelector} from 'react-redux'
import { locale } from '../../ui/locale'
import * as http from '../../modules/http'

export default function Forgot(props: any) {
    const auth = useSelector((state: any) => state.auth )

    const [formState, setFormState] = useState({loading: false, ready: false, error: null})
    const [email, setEmail] = useState('')

    if (auth.auth) {
        props.history.push('/')
    }

    function onChangeField(event: any) {
        if (event.target.name === 'email') {
            setEmail(event.target.value)
        }
    }

    async function onForgotClick(event: any) {
        event.preventDefault()
        if (email) {
            setFormState((prev) =>  ({...prev, loading: true, error: null}))

            const res = await http.httpPost('/auth/forgot', {email: email}, false)
    
            if (res.success) {
                setFormState((prev) =>  ({...prev, loading: false, ready: true, error: null}))
            } else {
                setFormState((prev) => ({...prev, loading: false, error: res.data.message}))
            }
        }
    }

    return (  
        formState.ready
        ? <div className="form welcome">
            <h1>{locale('auth.resetPasswordSentTitle')}</h1>
            <p>
                {locale('auth.resetPasswordSentP1Start')} {email} {locale('auth.resetPasswordSentP1End')}            
            </p>
            <p>{locale('auth.resetPasswordSentP2')}</p>
            <hr />
        </div>
        : <div className="form welcome">
        <h1>{locale('auth.resetPasswordTitle')}</h1>
            <p>{locale('auth.resetPasswordText1')}</p>
            <p>{locale('auth.resetPasswordText2')}</p>

        <form>
            {formState.error ? <p className="form-error">{locale(formState.error)}</p> : null}
            <div>
                <label>{locale('auth.email')}</label>
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={onChangeField}
                />
            </div>
            <div className="btn-group">
                <button 
                    className="btn primary" 
                    onClick={onForgotClick}
                    disabled={!email || formState.loading}
                >
                    {locale('auth.resetPasswordButton')}
                </button>
            </div>
        </form>
    </div>
    )
}
