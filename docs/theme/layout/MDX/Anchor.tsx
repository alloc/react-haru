import React, { Children } from 'react'
import { useHistory } from 'react-router-dom'

export function Anchor({ children, ...props }: any) {
  const history = useHistory()
  if (/^https?:\/\//.test(props.href)) {
    props.target = '_blank'
  }
  return (
    <a
      {...props}
      onClick={e => {
        if (!props.target) {
          e.preventDefault()
          history.push(props.href)
        }
      }}>
      {Children.toArray(children).map((elem, i) => (
        <React.Fragment key={i}>
          {typeof elem === 'string' ? <span>{elem}</span> : elem}
        </React.Fragment>
      ))}
    </a>
  )
}
