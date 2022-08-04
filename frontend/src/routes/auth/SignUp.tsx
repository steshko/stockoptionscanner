import React, { useState } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { locale } from '../../ui/locale'
import { LOGIN_SUCCESS } from '../../store/auth/authReducer'
import * as http from '../../modules/http'

export default function SignUp(props: any) {
    const dispatch = useDispatch();
    const auth = useSelector((state: any) => state.auth )

    const [formState, setFormState] = useState({loading: false, error: null})
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [check, setCheck] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formResult, setFormResult] = useState(null)

    if (auth.auth) {
        props.history.push('/')
    }

    function onChangeField(event: any) {
        if (event.target.name === 'email') {
            setEmail(event.target.value)
        } else if (event.target.name === 'password') {
            setPassword(event.target.value)
        } else if (event.target.name === 'check') {
            setCheck(prev => !prev)
        }
    }

    function termsClick(event: any) {
        event.preventDefault()
    }

    function privacyClick(event: any) {
        event.preventDefault()
    }

    async function onSignUpClick(event: any) {
        setFormState((prev) =>  ({...prev, loading: true, error: null}))

        const res = await http.httpPost('/auth/register', {email: email, password: password}, false)

        if (res.success) {
            setFormState((prev) =>  ({...prev, loading: false, error: null}))
            setFormResult(res.data)
        } else {
            setFormState((prev) => ({...prev, loading: false, error: res.data.message}))
        }
    }

    const onLoginClick = (event: any) => {
        event.preventDefault()
        dispatch( { type: LOGIN_SUCCESS, data: formResult } )
    }

    return (  
        formResult
        ? <div className="form welcome">
            <h1>{locale('auth.signUpReadyTitle')}</h1>
            <p>
                {locale('auth.signUpReadyP1Start')} {email} {locale('auth.signUpReadyP1End')}            
            </p>
            <p>{locale('auth.signUpReadyP2')}</p>
            <hr />
            <p>
                {locale('auth.signUpReadyP3Start')} <a href="/" onClick={onLoginClick}>
                {locale('auth.signUpReadyP3End')}</a>
            </p>
        </div>
        : <div className="form welcome">
        <h1>{locale('auth.signUpTitle')}</h1>
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
            <div>
                <label>{locale('auth.password')}</label>
                <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={onChangeField}

                />
                <span 
                    className={showPassword ? "cc-invisible" : "cc-eye"}
                    onClick={e => setShowPassword((prev) => !prev)}>
                </span>
            </div>
            <div>
                <input 
                    type="checkbox" 
                    id="pp"
                    name="check"
                    checked={check}
                    onChange={event => setCheck(prev => !prev)}
                    className="checkbox"
                />
                <label htmlFor="pp">
                    {locale('auth.signUpCheckStart')}
                    <a href="/" onClick={termsClick}>{locale('auth.signUpCheckTerms')}</a>
                    {locale('auth.signUpCheckAnd')}
                    <a href="/" onClick={privacyClick}>{locale('auth.signUpCheckPrivacy')}</a>.
                </label>
            </div>
            <div className="btn-group">
                <button 
                    className="btn primary" 
                    onClick={onSignUpClick}
                    disabled={!email || !password || !check || formState.loading}
                >
                    {locale('auth.signUp')}
                </button>
            </div>
        </form>
    </div>
    )
}
