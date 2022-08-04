import React from 'react';

export default function DrawBidAsk (row: any) {
    return (
        <>
            <span>{row.bid}</span>&nbsp;-&nbsp;<span>{row.ask}</span>
        </>
    )
}
