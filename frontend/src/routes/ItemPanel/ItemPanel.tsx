import React from 'react'
import Chain from './Chain'
import {useSelector} from 'react-redux'

export default function ItemPanel(props: any) {
    const itemPanel = useSelector( (state: any) => state.panel )

    return (
        !itemPanel.show
        ? null
        : <section className="section-details">
            <Chain symbol={itemPanel.symbol}/>
        </section>
    )
  }