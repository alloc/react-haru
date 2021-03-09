import cn from 'classnames'
import React from 'react'
import { a, SpringValue, useSpring, useTransition } from 'react-haru/web'
import { useInView } from 'react-intersection-observer'
import { Attraction } from '../utils/Attraction'
import { FlexEnd } from '../utils/FlexEnd'
import { usePage } from '../utils/PageContext'
import { ScaledText } from '../utils/ScaledText'
import { useValue } from '../utils/useValue'
import { Anchor } from './mdx/Anchor'
import css from './Header.module.sass'
import { SectionMenu } from 'components/SectionMenu'

interface Props {
  title?: string
}

export const Header = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const [hideRef, hideTitle] = useInView({
    initialInView: true,
    threshold: 0.5,
  })
  const currentTitle = hideTitle ? null : props.title
  const renderTitle = useTransition(currentTitle, {
    from: {
      scaleY: 0,
      opacity: 0,
      translateX: -10,
    },
    enter: {
      scaleY: 1,
      opacity: 1,
      translateX: 0,
      delay: key => (key == 'scaleY' ? 0 : 400),
      config: key => ({
        frequency: key !== 'scaleY' ? 0.9 : 0.4,
        damping: key == 'scaleY' ? 0.4 : 1,
      }),
    },
    leave: {
      scaleY: 0,
      opacity: 0,
      config: {
        frequency: 0.4,
        damping: 1,
      },
    },
    lead: 'leave',
    skip: title => title == null,
    expires: title => title !== currentTitle,
  })
  const page = usePage()
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
          {page.logo}
        </div>
        <div className="flex flex-1">
          {renderTitle(({ scaleY, opacity, translateX }, title, _i, phase) => (
            <>
              <a.div
                className="w-4px h-44/100 bg-rose3 self-center rounded-lg"
                style={{ scaleY }}
              />
              <SectionMenu
                className="flex flex-1"
                placeBelow
                disabled={phase == 'leave'}>
                <a.div
                  className={css.title}
                  style={{
                    opacity,
                    translateX,
                    rotateZ: '0.01deg',
                  }}>
                  <ScaledText className="self-center max-h-6.4">
                    {title}
                  </ScaledText>
                  <img src="/down2.svg" className="h-1.69 ml-1.84" />
                </a.div>
              </SectionMenu>
            </>
          ))}
        </div>
        {page.topRight && (
          <FlexEnd
            className={cn(css.topRight, 'mx-6.4 my-4.4 text-maroon text-6.0')}>
            {page.topRight.map((item, i) =>
              item instanceof Object && 'href' in item ? (
                <Anchor key={i} href={item.href} className="flex items-center">
                  <Attraction>{item.text}</Attraction>
                </Anchor>
              ) : (
                <React.Fragment key={i}>{item}</React.Fragment>
              )
            )}
          </FlexEnd>
        )}
      </header>
    </>
  )
})

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
