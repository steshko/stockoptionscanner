
import React from 'react';

export default function DrawSpreadMin (row: any) {

    return (
        <span className={row.resP > 0 ? "value-up" : "value-down"}>
            {row.resP.toFixed(2)}
        </span>
    )
}
