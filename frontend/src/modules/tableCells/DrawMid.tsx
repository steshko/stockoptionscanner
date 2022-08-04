
import React from 'react';

export default function DrawMid (row: any) {

    return (
        <span className={row.calc < row.mid ? "value-up" : "value-down"}>
            {row.mid.toFixed(2)}
        </span>
    )
}
