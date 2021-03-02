import { Lookup } from '@alloc/types'
import cn from 'classnames'
import React from 'react'
import { a, SpringValue, useSpring, useTransition } from 'react-haru/web'
import { useInView } from 'react-intersection-observer'
import { Attraction } from '../utils/Attraction'
import { FlexEnd } from '../utils/FlexEnd'
import { usePage } from '../utils/PageContext'
import { ScaledText } from '../utils/ScaledText'
import { Anchor } from './mdx/Anchor'
import css from './Header.module.sass'
import { useValue } from '../utils/useValue'

interface Props {
  page?: Lookup & { title?: string }
}

export const Header = React.forwardRef<HTMLDivElement, Props>(
  ({ page = {} }, ref) => {
    const [hideRef, hideTitle] = useInView({
      initialInView: true,
      threshold: 0.5,
    })
    const title = hideTitle ? null : page.title
    const renderTitle = useTransition(title, {
      from: {
        translateX: -10,
      },
      enter: {
        scaleY: 1,
        opacity: 1,
        translateX: 0,
      },
      leave: {
        scaleY: 0,
        opacity: 0,
      },
      lead: 'leave',
      reset: !hideTitle ? 'translateX' : [],
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
          className="sticky top-0 z-100 h-22.5 bg-rose1 flex flex-row select-none"
          style={{
            boxShadow: '0 2px 4px #F9F2F3',
          }}>
          <LinkCopied />
          <div className={cn(css.line, 'fill')} />
          <div className={css.logo} role="logo">
            {config.logo}
          </div>
          {renderTitle(({ scaleY, opacity, translateX }, title) => (
            <>
              <a.div
                className="w-4px h-44/100 bg-rose3 self-center rounded-lg"
                style={{ scaleY }}
              />
              <a.div
                className="flex flex-1 text-maroon tracking-tighter self-center font-500 font-h text-2rem mt-1.25 ml-4.8 mr-8.4"
                style={{ opacity, translateX, rotateZ: '0.01deg' }}>
                <ScaledText className="self-center max-h-6.4">
                  {title}
                </ScaledText>
              </a.div>
            </>
          ))}
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

export function copyLink(link: string) {
  navigator.clipboard.writeText(link)
  linkCopied.start(true)
  linkCopied.start(false, { delay: 1400 })
}

// When true, the LinkCopied element is visible.
const linkCopied = new SpringValue(false)

function LinkCopied() {
  const visible = useValue(linkCopied)
  const style = useSpring({
    from: { rotateZ: 0.01 },
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : 0.3,
    config: { frequency: 0.3 },
  })
  return (
    <div className={css.linkCopied}>
      <a.div style={style}>
        <strong>Copied</strong> link to clipboard
      </a.div>
    </div>
  )
}
