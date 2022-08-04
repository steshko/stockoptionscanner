import React from 'react';


export default function DrawLastPrice (row: any) {

    return (
        <>
            <div><strong>
                {row.underPrice}
            </strong></div>
            <div><span className={"description " + (row.change < 0 ? "value-down" : "value-up" )}>
            {row.change.toFixed(2).toLocaleString('en-Us')}&nbsp;
            {row.change < 0 ? '▼' : '▲'}&nbsp;
            {(row.percentChange).toFixed(2)  }% 
            </span></div>

        </>
    )
}
