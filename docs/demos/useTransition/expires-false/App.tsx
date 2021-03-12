import React from 'react'
import { a, useTransition } from 'react-haru/web'
import { style } from 'typestyle'
import { Props } from './props'

export function App(props: Props) {
  const items = props.visible ? [1] : []

  const transition = useTransition(items, {
    from: { scale: 0, opacity: 1 },
    enter: { scale: 1, reset: props.reset },
    leave: { opacity: 0 },
    expires: props.expires,
    config: () => key => ({
      frequency: 0.5,
      damping: key == 'opacity' ? 1 : 0.2,
    }),
  })

  const elems = transition(style => {
    return <a.div style={style} className={itemStyle} />
  })

  return (
    <>
      {elems}
      <div className={labelStyle}>
        {(elems.props.children.length ? 'M' : 'Not m') + 'ounted'}
      </div>
    </>
  )
}

const itemStyle = style({
  width: 20,
  height: 20,
  margin: 15,
  borderRadius: 999,
  background: '#FF007B',
})

const labelStyle = style({
  position: 'absolute',
  bottom: 0,
  marginBottom: '3rem',
  fontSize: '0.9rem',
  textAlign: 'center',
  color: 'gray',
})
