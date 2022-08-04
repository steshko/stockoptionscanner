import React from 'react';
import * as I from '../../store/interfaces'

export default function DrawExpiration (row: any) {

    return (
        <span>
            {I.getDateString(row.expDate)}
        </span>
    )
}
