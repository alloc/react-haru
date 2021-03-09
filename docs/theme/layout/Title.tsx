import { SectionMenu } from 'components/SectionMenu'
import React, { ReactNode } from 'react'
import { a, useSpring } from 'react-haru/web'
import { useFontLoaded } from '../utils/useFontLoaded'

import style from './Title.module.sass'

const GaussianBlur = a('feGaussianBlur')

interface Props {
  text: string
}

export const Title = React.forwardRef<HTMLDivElement, Props>(
  ({ text }, ref) => {
    let content: ReactNode

    // The filter lags heavily in Safari.
    let cancel = 'safari' in window
    if (!cancel) {
      const isFontLoaded = useFontLoaded()
      cancel = !isFontLoaded

      const { stdDeviation, filter, color } = useSpring({
        to: [{ stdDeviation: 0, color: '#EB0071' }, { filter: 'none' }],
        from: { stdDeviation: 2.4, color: '#FFFAFB', filter: 'url(#f)' },
        config: key => ({
          frequency: key == 'color' ? 1.5 : 2,
          precision: 0.1,
          velocity: key == 'color' ? 0 : -0.0075,
        }),
        cancel,
      })

      // TODO: use foreignObject for text wrapping
      content = (
        <svg viewBox="0 0 600 20">
          <defs>
            <filter id="f">
              <GaussianBlur
                in="SourceGraphic"
                stdDeviation={stdDeviation}
                result="blur"
              />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        1 0 1 0 0
                        0 0 0 15 -8"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
          <a.text x="0" y="15.5" fontSize={16} fill={color} filter={filter}>
            {text}
          </a.text>
        </svg>
      )
    } else {
      content = <h1>{text}</h1>
    }

    return (
      <div ref={ref} className="my-7.2">
        <div
          className="absolute z-80 top-1/2 left-0 mt-1.0"
          style={{ transform: 'translate(-100%, -50%)' }}>
          <SectionMenu>
            <MenuButton />
          </SectionMenu>
        </div>
        <div className="overflow-auto">
          <div className={style.title}>{content}</div>
        </div>
      </div>
    )
  }
)

const MenuButton = React.memo(() => {
  const style = useSpring({
    to: { scale: 1, opacity: 1 },
    from: { scale: 0.6, opacity: 0, rotateZ: '0.01deg' },
    config: key => ({ frequency: key == 'opacity' ? 0.7 : 1 }),
    delay: 1200,
  })
  const imgStyle = useSpring({
    to: { x: 0 },
    from: { x: 40 },
    config: { frequency: 0.9, damping: 0.7 },
    delay: 1500,
  })
  return (
    <a.div className="p-0.4rem m-0.5rem" style={style}>
      <div
        className="px-3.3 py-2.1 rounded-full bg-rose1 overflow-hidden"
        style={{ boxShadow: '0 0 0 1.5px #FF007B' }}>
        <a.img
          src="/menu.svg"
          className="h-3.0 block select-none bg-rose1"
          style={imgStyle}
        />
      </div>
    </a.div>
  )
})
