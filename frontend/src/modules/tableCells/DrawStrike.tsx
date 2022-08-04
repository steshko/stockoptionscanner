import React from 'react';

export default function DrawStrike (row: any) {
    return (
        <div>
            <strong>
                {row.strikePrice}<sub><span className="description secondary"> {row.strikeNum}</span></sub>
            </strong>
        </div>
    )
}
