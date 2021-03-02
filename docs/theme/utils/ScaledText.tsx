import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

/**
 * Text that scales to fit its defined `width` and/or `height`.
 *
 * Children must be SVG elements.
 */
export const ScaledText = ({ style = {}, children, ...props }: Props) => {
  const [viewBox, setViewBox] = useState(`0 0 0 0`)

  const textRef = useRef<SVGTextElement>(null)
  useLayoutEffect(() => {
    const { width, height } = textRef.current!.getBBox()
    setViewBox(`0 0 ${width} ${height}`)
  }, [children])

  styleKeys.forEach(key => {
    if (key in props) {
      style[key] = props[key]
      delete props[key]
    }
  })

  return (
    <svg
      {...props}
      style={style}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg">
      <text ref={textRef} fill="currentColor" style={textTransformStyle}>
        {children}
      </text>
    </svg>
  )
}

interface Props extends SVGProps, StyleProps {}

const textTransformStyle = {
  transform: 'translateY(50%)',
  transformOrigin: '0px 0px',
  dominantBaseline: 'middle',
} as const

const styleKeys = ['background'] as const

type StyleProps = Pick<React.CSSProperties, typeof styleKeys[number]>

type SVGProps = Omit<
  React.ClassAttributes<SVGSVGElement> & React.SVGAttributes<SVGSVGElement>,
  'xmlns' | 'viewBox' | 'fill'
>
