import React from 'react'
import { a, useSpring } from 'react-haru/dist/web'

import style from './style.module.sass'

const GaussianBlur = a('feGaussianBlur')

export const Title = ({ text }: { text: string }) => {
  const { stdDeviation } = useSpring({
    stdDeviation: 1,
    from: { stdDeviation: 0 },
    loop: { delay: 500 },
    onChange: console.log,
  })
  return (
    <svg className={style.title} viewBox="0 0 80 80">
      <defs>
        <filter id="goo-1">
          <GaussianBlur
            in="SourceGraphic"
            stdDeviation={stdDeviation}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    1 0 1 0 0
                    0 0 0 15 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <g filter="url(#goo-1)">
        <text x="0" y="15">
          {text}
        </text>
      </g>
    </svg>
  )
}
