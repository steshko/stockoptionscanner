// import React from 'react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import {
  BarChart, Bar, YAxis, Tooltip, ReferenceLine, LabelList
} from 'recharts';
// import { LinearProgress } from '@material-ui/core';


const renderCustomizedLabelUp = (props: any) => {
    const {x, y, width, height, value } = props;
    const minHeight = 40
    return (
      <>
        <text x={x + width / 2} y={y - 6} fontWeight={700}
            textAnchor="middle" dominantBaseline="middle">
          {value.symbol}
        </text>
        <text x={x + width / 2} y={y+height/2} 
            // fontWeight={500} 
            fill='white' 
            textAnchor="middle" dominantBaseline={height < minHeight ? "middle" : "top"}>
          {value.value}%
          {height < minHeight
          ? <> ${value.change}</>
          : null
          }          
        </text>
        {height >= minHeight
        ?<text x={x + width / 2} y={y+height/2 + 14} 
            // fontWeight={500} 
            fill='white' 
            textAnchor="middle" dominantBaseline="middle">
          ${value.change}
        </text>
        : null
        }
      </>
    );
  };



// const CustomTooltip = ({ active: any, payload, label }) => {
    const CustomTooltip = (params: any) => {
        const {active, payload} = params
        if (active && payload && payload.length) {
            // console.log(params.payload[0].payload)
            return (
            <div className="chart-tooltip">
                <h3>{params.payload[0].payload.gainerSymbol} ({params.payload[0].payload.gainerName})</h3>
                <p>{params.payload[0].payload.gainerSector}</p>
                <div className="indicators-details">
                    <span><h3>{params.payload[0].payload.gainerLast}</h3></span>
                    <span className={params.payload[0].payload.gainerChange > 0 ? "value-up" : "value-down"}>
                        {params.payload[0].payload.gainerChange}&nbsp;
                        {params.payload[0].payload.gainerChange > 0 ? "▲" : "▼"}
                        &nbsp;{params.payload[0].payload.gainerChangePercent}%
                    </span>
                </div>
                <hr />
                {/* <p>&nbsp;</p> */}
                <h3>{params.payload[0].payload.loserSymbol} ({params.payload[0].payload.loserName})</h3>
                <p>{params.payload[0].payload.loserSector}</p>
                <div className="indicators-details">
                    <span><h3>{params.payload[0].payload.loserLast}</h3></span>
                    <span className={params.payload[0].payload.loserChange > 0 ? "value-up" : "value-down"}>
                        {params.payload[0].payload.loserChange}&nbsp;
                        {params.payload[0].payload.loserChange > 0 ? "▲" : "▼"}
                        &nbsp;{params.payload[0].payload.loserChangePercent}%
                    </span>
                </div>
    
            </div>
            );
    }
    
    return null;
    };
  
export default function TopMoversChart(p: any) {

    // const renderCustomizedLabelDown = useCallback((props: any) => {
    const renderCustomizedLabelDown = (props: any) => {
        const {x, y, width, height, value } = props;
        const minHeight = 40
        // console.log('renderCustomizedLabelDown', props)
        return (
          <>
            <text x={x + width / 2} y={y + 10} fontWeight={700}
            textAnchor="middle" dominantBaseline="middle">
              {value.symbol}
            </text>
            <text x={x + width / 2} y={y+height/2} 
                // fontWeight={500} 
                fill='white' 
                textAnchor="middle" dominantBaseline={-height < minHeight ? "middle" : "top"}>
              {-value.value}%
              {-height < minHeight
              ? <> ${-value.change}</>
              : null
              }          
            </text>
            {-height >= minHeight
            ?<text x={x + width / 2} y={y+height/2 + 14} 
                // fontWeight={500} 
                fill='white' 
                textAnchor="middle" dominantBaseline="middle">
              ${-value.change}
            </text>
            : null
            }
    
          </>
        );
    // }, []);
    };


    const data = useMemo(() => {
        const list: any[] = []
        for (let i=0; i<15; i++) {
            if (p.gainers.length > i && p.losers.length > i ) {
                list.push({
                    // gainerName: `${p.gainers[i].symbol} ${p.gainers[i].changePercent.toFixed(0)}%`,
                    gainerSymbol: p.gainers[i].symbol,
                    gainerName: p.gainers[i].name,
                    gainerSector: p.gainers[i].sector,
                    gainerLast: p.gainers[i].last,
                    gainerChangePercent: p.gainers[i].changePercent.toFixed(0),
                    gainerChange: p.gainers[i].change.toFixed(2),
                    gainerLabel: {
                        symbol: p.gainers[i].symbol, 
                        value: p.gainers[i].changePercent.toFixed(0),
                        change: p.gainers[i].change.toFixed(2)
                    },

                    loserSymbol: p.losers[i].symbol,
                    loserName: p.losers[i].name,
                    loserSector: p.losers[i].sector,
                    loserLast: p.losers[i].last,
                    loserChangePercent: p.losers[i].changePercent.toFixed(0),
                    loserChange: p.losers[i].change.toFixed(2),
                    loserLabel: {
                        symbol: p.losers[i].symbol, 
                        value: p.losers[i].changePercent.toFixed(0),
                        change: p.losers[i].change.toFixed(2)
                    },

                    // loserName: `${p.losers[i].symbol}`,
                    // loser: p.losers[i].changePercent.toFixed(2),
                })
            }
        }
        return list
    }, [p.gainers, p.losers])

    // console.log(data)
    return ( 
        <div style={{overflowX:"scroll", border: '1px solid rgba(0, 0, 0, 0.12)', padding: '8px'}}>
        {p.loading
        ? <></>
        : <BarChart
            width={1800}
            height={320}
            data={data}
            // isAnimationActive={false}
            // stackOffset="sign"
            stackOffset="sign"
            margin={{top: 30, right: 10, left: 10, bottom: 20,}}
        >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            {/* <XAxis /> */}
            <YAxis />
            <Tooltip 
                content={<CustomTooltip />}
            />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="gainerChangePercent" isAnimationActive={false} fill="#178C38" stackId="stack" >
                <LabelList 
                    dataKey="gainerLabel" 
                    position="top"
                    content={renderCustomizedLabelUp} 
                />
            </Bar>
            <Bar dataKey="loserChangePercent" isAnimationActive={false} fill="#C51B29" stackId="stack">
                <LabelList 
                    dataKey="loserLabel" 
                    // dataKey="loserSymbol" 
                    // position="outside"
                    // color="#C51B29"
                    content={renderCustomizedLabelDown} 
                />
            </Bar>
        </BarChart>
        }
        </div>
        
    )
}

