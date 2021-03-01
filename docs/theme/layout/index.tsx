import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { a, useSpring } from 'react-haru/web'
import type { PagesStaticData } from 'vite-plugin-react-pages'
import { PathConfig } from '../config'
import { setScrollEnabled } from '../utils/scroll'
import { useFontLoaded } from '../utils/useFontLoaded'
import { Header } from './Header'
import { Title } from './Title'
import { useHeight } from '../utils/useHeight'
import { useLayoutEffect } from 'react'
import { useScrollToHash } from '../utils/useScrollToHash'
import { useQueue } from '../utils/queue'
import { usePage } from '../utils/PageContext'

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

  // Postpone scrolling to url hash until animation is done.
  const queue = useQueue((fn: Function) => fn())
  useScrollToHash(queue)

  const isFontLoaded = useFontLoaded()

  const [wiperHidden, setWiperHidden] = useState(false)
  const [wiperHeight, setWiperHeight] = useState(0)
  const wiperBlendHeight = 120

  const [headerRef, headerHeight] = useHeight()
  const [titleRef, titleHeight] = useHeight()

  useLayoutEffect(() => {
    if (headerHeight >= 0 && (!title || titleHeight >= 0))
      setWiperHeight(window.innerHeight - headerHeight - titleHeight)
  }, [headerHeight, title, titleHeight])

  const { translateY } = useSpring({
    translateY: wiperHeight + wiperBlendHeight,
    from: { translateY: 0 },
    config: { clamp: true, frequency: 8, velocity: 2 },
    delay: 1400,
    cancel: !isFontLoaded || !wiperHeight,
    onRest() {
      setWiperHidden(true)
      setScrollEnabled(true)
      queue.flush()
    },
  })

  const wiper = !wiperHidden && (
    <div
      className="absolute top-0 overflow-hidden"
      style={{
        left: -20, // Ensure code blocks are covered.
        right: -20,
        height: '110%',
      }}>
      <a.div
        className="absolute w-1/1 bg-rose1"
        style={{
          height: wiperHeight,
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
    <div className="min-h-100vh bg-rose1">
      <Header ref={headerRef} page={page.main} />
      <div className="-sm:w-95/100 w-8/10 max-w-920px mx-auto" key={path}>
        {title && <Title ref={titleRef} text={title} />}
        <div>
          {children}
          {wiper}
        </div>
      </div>
    </div>
  )
}
