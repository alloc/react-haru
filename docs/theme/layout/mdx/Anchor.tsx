import React, { Children } from 'react'
import { useHistory } from 'react-router-dom'

type Props = React.ComponentProps<'a'>

export const Anchor = React.forwardRef<HTMLAnchorElement, Props>(
  ({ children, ...props }, ref) => {
    const history = useHistory()
    if (/^https?:\/\//.test(props.href!)) {
      props.target = '_blank'
    }
    return (
      <a
        {...props}
        ref={ref}
        onClick={e => {
          props.onClick?.(e)
          if (!props.target && props.href) {
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
)
