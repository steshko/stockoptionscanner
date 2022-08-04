import React from 'react'

export const DiscountSelect = (props: any) => {
    return (
        // !props.screenMode
        // ? <div className="tabs">
        //     <span>Discount</span>
        //     {props.tabs.map((tab: string, index: number) => (
        //     <>
        //         <input 
        //             type="radio" 
        //             id={tab}
        //             checked={tab === props.value}
        //             onChange={e => props.onTabChange(e, index)}
        //         />
        //         <label htmlFor={tab} onClick={e => props.onTabChange(e, tab)}>{tab} %</label>
        //     </>    
        //     ))
        //     }
        // </div>
        // : 
        <div className="dropdown">
            <span>{props.label}</span>
        <div>
            <button 
                className="btn" 
                type="button" 
                id="tab" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
            >
            {props.value} %
            </button>
            <ul className="dropdown-menu" aria-labelledby="tab">
                {props.tabs.map((tab: string, index: number) => (
                    <li key={index}>
                        <a 
                            className={"dropdown-item" + (tab === props.value ? " selected" : "")}
                            href="/"
                            onClick={e => props.onTabChange(e, tab)}
                        >
                            {tab} %
                        </a>
                    </li>    
                ))}
            </ul>
        </div>
        </div>
    )
}