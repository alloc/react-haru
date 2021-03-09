import cn from 'classnames'
import React, { useMemo, useRef, useState } from 'react'
import { Channel, useChannel } from 'react-ch'
import { a, useSpring, CSS, to, SpringValue } from 'react-haru/web'
import { useHotkeys } from 'react-hotkeys-hook'
import { useHistory } from 'react-router-dom'
import { usePage } from 'theme/config'
import { Anchor } from 'theme/layout/mdx/Anchor'
import { useCancellableDelay } from 'theme/utils/useCancellableDelay'
import { usePrev } from 'theme/utils/usePrev'
import { useStaticData } from 'vite-plugin-react-pages/dist/client'
import { SectionData } from './DocsFilter/getFindablePages'
import css from './SectionMenu.module.sass'

export function SectionMenu() {
  const page = usePage()
  const title = useStaticData<string>(page.path, data => data.main.title)
  const sections = useStaticData<SectionData | undefined>(
    page.path,
    data => data.main.sections
  )?.filter(section => {
    // Hide <h3> sections.
    return section[2] < 3
  })

  const mouseTimeout = useCancellableDelay()
  const onVisible = useChannel<boolean>()

  return sections?.length ? (
    <div
      onMouseEnter={() => {
        mouseTimeout(() => {
          onVisible(true)
        }, 150)
      }}
      onMouseLeave={() => {
        mouseTimeout(() => {
          // onVisible(false)
        }, 300)
      }}>
      <MenuButton />
      <Menu title={title} sections={sections} onVisible={onVisible} />
    </div>
  ) : null
}

interface MenuProps {
  title: string
  sections: SectionData
  onVisible: Channel<boolean>
}

const Menu = React.memo((props: MenuProps) => {
  const [visible, setVisible] = useState(true)
  useChannel(props.onVisible, nextVisible => {
    if (nextVisible !== visible) {
      setVisible(nextVisible)
      if (nextVisible) {
        selectIndex(0)
        scrollRef.current!.scrollTop = 0
      }
    }
  })

  const scrollRef = useRef<HTMLDivElement>(null)

  const isAnimating = useMemo(() => new SpringValue(false), [])
  const minScale = 0.4
  const style = useSpring({
    scale: visible ? 1 : minScale,
    opacity: visible ? 1 : 0,
    pointerEvents: (visible
      ? 'inherit'
      : 'none') as CSS.Properties['pointerEvents'],
    config: key => ({
      frequency: key == 'opacity' ? 0.2 : 0.35,
      damping: visible ? 1.1 : 1,
    }),
    onStart: () => isAnimating.set(true),
    onRest: () => isAnimating.set(false),
  })

  const history = useHistory()
  const [selectedIndex, selectIndex] = useState(0)
  const selectedSection = props.sections[selectedIndex]
  const maxIndex = props.sections.length - 1

  function gotoSelection() {
    if (visible) {
      history.push('#' + selectedSection[0])
      props.onVisible(false)
    }
  }
  function selectPrevious(event: KeyboardEvent) {
    if (visible) {
      event.preventDefault()
      selectIndex(i => (i == 0 ? maxIndex : i - 1))
    }
  }
  function selectNext(event: KeyboardEvent) {
    if (visible) {
      event.preventDefault()
      selectIndex(i => (i == maxIndex ? 0 : i + 1))
    }
  }

  useHotkeys('enter', gotoSelection, [visible, selectedSection])
  useHotkeys('up', selectPrevious, [visible, maxIndex])
  useHotkeys('down', selectNext, [visible, maxIndex])

  let lastRank1 = -1
  const sectionLinks = props.sections.map(([slug, title, rank], i) => {
    if (rank == 1) lastRank1 = i
    const selected = i === selectedIndex
    return (
      <Anchor
        href={'#' + slug}
        onMouseEnter={() => selectIndex(i)}
        className={cn(
          'flex items-center w-full',
          rank > 1 ? 'h-8.4' : 'h-10.4',
          rank > 1 && ~lastRank1 ? 'pl-9.6 text-1.05rem' : 'pl-7.2 text-1.2rem',
          selected ? 'text-deepPink3 font-600' : 'text-black font-400'
        )}>
        {title}
      </Anchor>
    )
  })

  const prevHidden = usePrev(!visible)
  console.log({ prevHidden, selectedIndex, visible })
  const cursorStyle = useSpring({
    y: computeCursorY(selectedIndex, props.sections),
    immediate: prevHidden,
    config: {
      frequency: 0.32,
      damping: 0.72,
    },
  })

  return (
    <a.div
      className={css.menu}
      style={{
        ...style,
        scale: undefined,
        transform: to(
          [style.scale, isAnimating],
          (scale, isAnimating) =>
            `translate3d(-60%, -40%, 0) scale(${scale}) translate(60%, 40%)` +
            (true ? ` rotateZ(0.01deg)` : ``)
        ),
      }}>
      <div className="absolute w-full rounded-0.9rem">
        <div ref={scrollRef} className={css.content}>
          <div className={css.title}>{props.title}</div>
          <img src="/accent2.svg" className="absolute top-0 right-0 h-9.4" />
          <div className="pb-4.6">
            {sectionLinks}
            <a.img
              src="/menu-cursor.svg"
              className={css.cursor}
              style={cursorStyle}
            />
          </div>
        </div>
        <div className={css.border} />
      </div>
    </a.div>
  )
})

function computeCursorY(selectedIndex: number, sections: SectionData) {
  let cursorY = 0
  for (let i = 0; i < selectedIndex; i++) {
    cursorY += sections[i][2] > 1 ? 2.1 : 2.6
  }
  return cursorY + 'rem'
}

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
