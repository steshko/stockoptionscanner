import React, { useState } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { locale } from '../../ui/locale'
import * as authActions from '../../store/auth/authActions'
import { Link } from 'react-router-dom'

export default function SignIn(props: any) {
    const dispatch = useDispatch();
    const auth = useSelector((state: any) => state.auth )

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    if (auth.auth) {
        props.history.push('/')
    }

    function onChangeField(event: any) {
        console.log(event);
        if (event.target.name === 'email') {
            setEmail(event.target.value)
        } else if (event.target.name === 'password') {
            setPassword(event.target.value)
        } else if (event.target.name === 'rememberMe') {
            setRememberMe(prev => !prev)
        }
    }

    const onLoginClick = (event: any) => {
        event.preventDefault()
        dispatch(authActions.login({email, password, rememberMe}))
    }

    return (  
        <div className="form welcome">
        <h1>{locale('auth.signInTitle')}</h1>
        <form>
            {auth.error ? <p className="form-error">{locale(auth.error)}</p> : null}
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
                <label>
                    {locale('auth.password')}
                    <span style={{position: 'absolute', right: 0, fontSize: '1rem'}}>
                        <Link to='/forgot'>{locale('auth.forgotPassword')}</Link>
                    </span>
                </label>
                <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={onChangeField}
                />
                <span 
                    className={showPassword ? "cc-eye" : "cc-invisible"}
                    onClick={e => setShowPassword((prev) => !prev)}>
                </span>
            </div>
            <div>
                <input 
                    type="checkbox" 
                    name="checkbox" 
                    id="checkbox" 
                    className="checkbox"
                    checked={rememberMe}
                    onChange={event => setRememberMe(prev => !prev)}
                />
                <label htmlFor="checkbox">
                    {locale('auth.rememberMe')}
                </label>
            </div>

            {/* <div>
                <input 
                    type="checkbox" 
                    id="pp"
                    name="check"
                    checked={rememberMe}
                    onChange={event => setRememberMe(prev => !prev)}
                />
                <label htmlFor="pp">
                    {locale('auth.rememberMe')}
                </label>
            </div> */}
            <div className="btn-group">
                <button 
                    className="btn primary" 
                    onClick={onLoginClick}
                    disabled={!email || !password || auth.loading}
                >
                    {locale('auth.signIn')}
                </button>
            </div>
        </form>
    </div>
    )
}
