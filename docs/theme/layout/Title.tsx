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
      <div ref={ref} className="overflow-auto">
        <div className={style.title}>{content}</div>
      </div>
    )
  }
)
