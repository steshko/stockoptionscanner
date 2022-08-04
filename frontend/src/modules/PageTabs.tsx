import React from 'react'

export const PageTabs = (props: any) => {
    return (
        !props.screenMode
        ? <div className="tabs">
            {props.tabs.map((tab: string, index: number) => (
            <>
                <input 
                    type="radio" 
                    id={tab}
                    checked={index === props.activeIndex}
                    onChange={e => props.onTabChange(e, index)}
                />
                <label htmlFor={tab} onClick={e => props.onTabChange(e, index)}>{tab}</label>
            </>    
            ))
            }
        </div>
        : <div className="dropdown">
        <div>
            <button 
                className="btn" 
                type="button" 
                id="tab" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
            >
            {props.tabs[props.activeIndex]}
            </button>
            <ul className="dropdown-menu" aria-labelledby="tab">
                {props.tabs.map((tab: string, index: number) => (
                    <li key={index}>
                        <a 
                            className={"dropdown-item" + (index === props.activeIndex ? " selected" : "")}
                            href="/"
                            onClick={e => props.onTabChange(e, index)}
                        >
                            {tab}
                        </a>
                    </li>    
                ))}
            </ul>
        </div>
        </div>
    )
}