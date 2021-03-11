import React from 'react'
import { a, useTransition } from 'react-haru/web'
import { style } from 'typestyle'
import { Props } from './props'

export function App(props: Props) {
  const items = props.visible ? [1, 2, 3] : []

  const renderItems = useTransition(items, {
    enter: { opacity: 1 },
    leave: { opacity: 0.1 },
    trail: 120,
    onProps(props, item) {
      console.log(item, props)
    },
  })

  return renderItems((style, item) => {
    console.log(item, style)
    return <a.div style={style} className={itemStyle} />
  })
}

const itemStyle = style({
  width: 50,
  height: 50,
  background: 'black',
})
