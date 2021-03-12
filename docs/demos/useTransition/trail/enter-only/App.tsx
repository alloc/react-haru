import React from 'react'
import { a, useTransition } from 'react-haru/web'
import { style } from 'typestyle'
import { Props } from './props'

export function App(props: Props) {
  const items = props.visible ? [1, 2, 3] : []

  const renderItems = useTransition(items, {
    trail: props.trail,
    from: { scale: 0, opacity: 1 },
    enter: {
      scale: 1,
      config: { frequency: 0.5, damping: 0.2 },
    },
    leave: {
      opacity: 0,
      config: { frequency: 0.4, damping: 1 },
      delay: 0,
    },
    // Prevent unmount.
    expires: false,
  })

  return renderItems(style => {
    return <a.div style={style} className={itemStyle} />
  })
}

const itemStyle = style({
  width: 20,
  height: 20,
  margin: 15,
  borderRadius: 999,
  background: '#FF007B',
})
