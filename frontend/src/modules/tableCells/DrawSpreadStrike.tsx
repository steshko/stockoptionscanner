import React from 'react';

export default function DrawSpreadStrike (row: any) {
    return (
        <>
        <div className="tooltip">
            {/* <a href="#">{row.strikeLow}&nbsp;-&nbsp;{row.strikeHight}</a> */}
            <span>{row.strikeLow}&nbsp;-&nbsp;{row.strikeHight}</span>
            {/* <strong>{row.strikeLow}&nbsp;-&nbsp;{row.strikeHight}</strong> */}
            <div className="tooltip-right">
                <table>
                    <thead>
                        <tr>
                            <th className=" align-left">Strike</th>
                            <th className=" align-left">Bid</th>
                            <th className=" align-left">Ask</th>
                            <th className=" align-left">Mid</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className=" align-left"><strong>{row.strikeLow}</strong></td>
                            <td className=" align-left">{row.lowBid}</td>
                            <td className=" align-left">{row.lowAsk}</td>
                            <td className=" align-left">{((row.lowBid + row.lowAsk) / 2).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className=" align-left"><strong>{row.strikeHight}</strong></td>
                            <td className=" align-left">{row.hightBid}</td>
                            <td className=" align-left">{row.hightAsk}</td>
                            <td className=" align-left">{((row.hightBid + row.hightAsk) / 2).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* <strong>
            {row.strikeLow}&nbsp;-&nbsp;{row.strikeHight}
        </strong> */}
        <div>
            <span className="description secondary">
                {(row.strikeHight - row.strikeLow).toFixed(2)}
            </span>
        </div>
        </>
    )
}
