import React from 'react'
import { a, useSpring } from 'react-haru/web'
import { style } from 'typestyle'
import { Props } from './props'

export function App(props: Props) {
  console.log(props)
  const style = useSpring({
    to: backAndForth,
    config: () => ({
      tension: props.tension,
    }),
  })

  return <a.div style={style} className={itemStyle} />
}

// Cache the "to" prop outside our component to
// avoid restarting the loop on rerender.
const backAndForth = [
  {
    to: { x: '3rem' },
    from: { x: '-3rem' },
    loop: { reverse: true },
  },
]

const itemStyle = style({
  width: 20,
  height: 20,
  borderRadius: 999,
  background: '#FF007B',
})
