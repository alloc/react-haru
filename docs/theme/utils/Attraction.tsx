import React, { useRef } from 'react'
import cn from 'classnames'
import { a, SpringConfig, useSpring } from 'react-haru/web'
import { rubberbandIfOutOfBounds } from './rubberband'
import { getScrollTop } from './scroll'

export function Attraction(props: React.ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  const style = useSpring({
    from: { translateX: 0, translateY: 0, rotateZ: 0.01 },
  })
  return (
    <>
      <div
        className="fill"
        onMouseMove={e => {
          const parent = ref.current?.parentElement
          if (!parent) return

          const { top, left, width, height } = parent.getBoundingClientRect()

          let x = (e.pageX - left) / width
          let y = (e.pageY - top - getScrollTop()) / height

          let vx = 0.1 * (x -= 0.5)
          let vy = 0.1 * (y -= 0.5)

          x = rubberbandIfOutOfBounds(x, 0, 0)
          y = rubberbandIfOutOfBounds(y, 0, 0)

          const config: SpringConfig = {
            frequency: 1.15,
            damping: 1,
          }

          config.velocity = vx
          style.translateX.start((width / 6) * x, { config })

          config.velocity = vy
          style.translateY.start((height / 6) * y, { config })
        }}
        onMouseEnter={() => {
          // Reset initial velocity
          style.translateX.stop()
          style.translateY.stop()
        }}
        onMouseLeave={() => {
          const config = {
            frequency: 0.6,
            damping: 0.6,
          }

          style.translateX.start(0, { config })
          style.translateY.start(0, { config })
        }}
      />
      <a.div
        {...props}
        ref={ref}
        style={style}
        className={cn('pointer-events-none', props.className)}>
        {props.children}
      </a.div>
    </>
  )
}
