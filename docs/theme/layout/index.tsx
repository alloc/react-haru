import React, { ReactNode, useEffect, useState } from 'react'
import { a, useSpring, useTransition } from 'react-haru/web'
import { setScrollEnabled } from '../utils/scroll'
import { useFontLoaded } from '../utils/useFontLoaded'
import { Header } from './Header'
import { Title } from './Title'
import { useHeight } from '../utils/useHeight'
import { useLayoutEffect } from 'react'
import { useScrollToHash } from '../utils/useScrollToHash'
import { useQueue } from '../utils/queue'
import { usePage } from '../utils/PageContext'
import { Footer } from './Footer'

interface Props {
  children: ReactNode
}

// Disable scrolling until page is loaded.
setScrollEnabled(false)

export function Layout({ children }: Props) {
  const { path, page } = usePage()
  const { title } = page.main!

  useEffect(() => {
    document.title = title + ' | react-haru'
  }, [title])

  console.log('Layout.render:', path)
  const currentState = { path, title, children }
  const renderContent = useTransition(currentState, {
    key: state => state.path,
    config: { frequency: 0.3 },
    from: { opacity: 1, immediate: true },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    lead: 'leave',
  })

  const [headerRef, headerHeight] = useHeight()
  return (
    <div className="flex flex-col min-h-100vh bg-rose1">
      <Header ref={headerRef} page={page.main} />
      {renderContent((style, state) => {
        return (
          <a.div className="flex flex-col flex-1" style={style}>
            <Content title={state.title} headerHeight={headerHeight}>
              {state.children}
            </Content>
          </a.div>
        )
      })}
    </div>
  )
}

interface ContentProps {
  title?: string
  headerHeight: number
  children: any
}

function Content({ title, headerHeight, children }: ContentProps) {
  const [titleRef, titleHeight] = useHeight()
  const [contentRef, contentHeight] = useHeight()

  const [wiperHidden, setWiperHidden] = useState(false)
  const [wiperHeight, setWiperHeight] = useState(0)
  const wiperBlendHeight = 120

  useLayoutEffect(() => {
    if (headerHeight >= 0 && contentHeight >= 0 && (!title || titleHeight >= 0))
      setWiperHeight(
        Math.min(contentHeight, window.innerHeight - headerHeight - titleHeight)
      )
  }, [headerHeight, contentHeight, title, titleHeight])

  // Postpone scrolling to url hash until animation is done.
  const queue = useQueue((fn: Function) => fn())
  useScrollToHash(queue)

  const isFontLoaded = useFontLoaded()
  const { translateY } = useSpring({
    translateY: wiperHeight + wiperBlendHeight,
    from: { translateY: 0 },
    config: {
      frequency: 2,
      damping: 1.004,
      velocity: 2.2,
      // Jump to end once within 20 pixels,
      // since damping > 1 leads to slow ending.
      precision: 20,
    },
    delay: 420,
    cancel: !isFontLoaded || !wiperHeight,
    onRest() {
      setWiperHidden(true)
      setScrollEnabled(true)
      queue.flush()
    },
  })

  const wiper = !wiperHidden && (
    <div className="absolute -inset-20px overflow-hidden">
      <a.div
        className="absolute top-20px w-1/1 bg-rose1"
        style={{
          height: wiperHeight + 20,
          translateY,
        }}>
        <div
          style={{
            background:
              'linear-gradient(0deg, rgba(255,250,251,1) 0%, rgba(255,250,251,0) 100%)',
            height: wiperBlendHeight,
            top: -wiperBlendHeight,
          }}
        />
      </a.div>
    </div>
  )

  return (
    <>
      <div className="-sm:w-95/100 w-8/10 max-w-920px flex-1 mx-auto">
        {title && <Title ref={titleRef} text={title} />}
        <div ref={contentRef} style={{ opacity: wiperHeight ? 1 : 0 }}>
          {children}
          {wiper}
        </div>
      </div>
      {wiperHidden && <Footer />}
    </>
  )
}
