import React from 'react';

export default function DrawDividends (row: any) {

    return (
        row.div
        ? <span className={//color ? "value-up" : ""
            row.div.toISOString() <= row.expDate 
            ? "value-up" 
            : ""
    
        }>
            {row.div.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
        </span>
        : null
    )
}
