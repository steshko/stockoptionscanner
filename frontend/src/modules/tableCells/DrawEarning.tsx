import React from 'react';

export default function DrawEarning (row: any) {

    return (
        row.earn
        ? <>
            <div className={
                row.earn.toISOString() <= row.expDate 
                ? "value-down" 
                : ""
            }>
                {row.earn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
            
            </div>
            <div>
                <span className="description secondary">
                    {row.earnTime}
                </span>
            </div>
        </>
        : null
    )
}
