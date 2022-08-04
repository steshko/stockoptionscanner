
import React from 'react';

export default function DrawSpreadMid (row: any) {

    return (
        <span className={row.res > 0 ? "value-up" : "value-down"}>
            {row.res.toFixed(2)}
        </span>
    )
}
