import cn from 'classnames'
import React from 'react'
import { a, useSpring } from 'react-haru/web'
import { useInView } from 'react-intersection-observer'
import { PathConfig } from '../config'
import css from './Header.module.sass'

interface Props {
  page: any
  config: PathConfig
}

export const Header = React.forwardRef<HTMLDivElement, Props>(
  ({ page, config }, ref) => {
    const [hideRef, hideTitle] = useInView({
      initialInView: true,
      threshold: 0.5,
    })
    const { scaleY, opacity, translateX } = useSpring({
      scaleY: hideTitle ? 0 : 1,
      opacity: hideTitle ? 0 : 1,
      translateX: hideTitle ? undefined : 0,
      from: { translateX: -10 },
      reset: !hideTitle ? 'translateX' : [],
      delay: key => (key == 'scaleY' || hideTitle ? 0 : 400),
      config: key => ({
        frequency: key !== 'scaleY' && !hideTitle ? 0.9 : 0.4,
        damping: key == 'scaleY' && !hideTitle ? 0.4 : 1,
      }),
    })
    return (
      <>
        <div className="absolute top-0 h-24.5" ref={hideRef} />
        <div
          ref={ref}
          className="sticky top-0 z-100 h-24.5 bg-rose1 flex flex-row"
          style={{
            borderBottom: '1px solid #F2DFE3',
            boxShadow: '0 2px 4px #F9F2F3',
          }}>
          <div className={css.logo} role="logo">
            {config.logo}
          </div>
          <a.div
            className="w-4px h-44/100 bg-rose3 self-center rounded-lg"
            style={{ scaleY }}
          />
          <a.div
            className="text-maroon tracking-tighter self-center font-500 font-h text-2rem mt-1.25 ml-4.8"
            style={{ opacity, translateX, rotateZ: '0.01deg' }}>
            {page.title}
          </a.div>
          <FlexEnd className="mx-9.6 my-4.4 bg-red"></FlexEnd>
        </div>
      </>
    )
  }
)

function FlexEnd(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex flex-inherit flex-1 justify-end', props.className)}
    />
  )
}
