import React from 'react'
import { locale } from '../ui/locale'

export const NotFound = () => {

    return (
        <div className="cc-empty-page">
            <h2>{locale('pageNotFound.title')}</h2>
        </div>
    )
}