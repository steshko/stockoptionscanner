
import React from 'react';


export default function DrawOptionMid (row: any) {

    return (
        <span className={row.calc <= row.res ? "value-up" : "value-down"}>
            {row.res.toFixed(2)}
        </span>
)
}
