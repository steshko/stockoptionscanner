import React from 'react';
import {useSelector} from 'react-redux'


const DrawCompany = (row: any) => {
    const colorList = useSelector((state: any) => state.auth.industryColor )
    const colorIndex =  colorList
        ? colorList.findIndex((color: any) => color.industry === row.sector)
        : -1
    return (
        <>
            <div>
                {row.companyName}
            </div>
            <div><span 
                // className="description secondary" 
                className={
                    colorIndex >= 0 && colorList[colorIndex].color !== 'default'
                    ? `sector palette-${colorList[colorIndex].color}`
                    : "description secondary"
                }
                // className={"sector" + (colorIndex >=0 ? " palette-" + colorList[colorIndex].color : "")}
                // style={colorIndex >=0 ? {color: colorList[colorIndex].color} : {} }
            >
            {row.sector}
            </span></div>
            <div><span className="description secondary">
            {row.industry}
            </span></div>
        </>
    )
}

export default DrawCompany