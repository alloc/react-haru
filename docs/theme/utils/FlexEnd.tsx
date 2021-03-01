import React from 'react'
import cn from 'classnames'

export function FlexEnd(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex flex-inherit flex-1 justify-end', props.className)}
    />
  )
}
