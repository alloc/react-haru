import { Lookup } from '@alloc/types'
import cn from 'classnames'
import React from 'react'
import { a, useSpring } from 'react-haru/web'
import { useInView } from 'react-intersection-observer'
import { Attraction } from '../utils/Attraction'
import { usePage } from '../utils/PageContext'
import css from './Header.module.sass'
import { Anchor } from './mdx/Anchor'

interface Props {
  page?: Lookup & { title?: string }
}

export const Header = React.forwardRef<HTMLDivElement, Props>(
  ({ page = {} }, ref) => {
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
      cancel: !page.title,
      delay: key => (key == 'scaleY' || hideTitle ? 0 : 400),
      config: key => ({
        frequency: key !== 'scaleY' && !hideTitle ? 0.9 : 0.4,
        damping: key == 'scaleY' && !hideTitle ? 0.4 : 1,
      }),
    })
    const { config } = usePage()
    return (
      <>
        <div className="absolute top-0 h-22.5" ref={hideRef} />
        <header
          ref={ref}
          className="sticky top-0 z-100 h-22.5 bg-rose1 flex flex-row"
          style={{
            boxShadow: '0 2px 4px #F9F2F3',
          }}>
          <div className={cn(css.line, 'fill')} />
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
          {config.topRight && (
            <FlexEnd
              className={cn(
                css.topRight,
                'mx-6.4 my-4.4 text-maroon text-6.0'
              )}>
              {config.topRight.map(item =>
                item instanceof Object && 'href' in item ? (
                  <Anchor href={item.href} className="flex items-center">
                    <Attraction>{item.text}</Attraction>
                  </Anchor>
                ) : (
                  item
                )
              )}
            </FlexEnd>
          )}
        </header>
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
