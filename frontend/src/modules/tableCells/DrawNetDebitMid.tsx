
import React from 'react';

export default function DrawNetDebitMid (row: any) {

    return (
        <span className={row.calc >= row.netDebitMid ? "value-up" : "value-down"}>
            {row.netDebitMid.toFixed(2)}
        </span>
    )
}
