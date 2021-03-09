import cn from 'classnames'
import React, { ReactNode, useRef, useState } from 'react'
import { Channel, useChannel } from 'react-ch'
import { a, useSpring, CSS } from 'react-haru/web'
import { useHotkeys } from 'react-hotkeys-hook'
import { useHistory } from 'react-router-dom'
import { usePage } from 'theme/config'
import { Anchor } from 'theme/layout/mdx/Anchor'
import { useCancellableDelay } from 'theme/utils/useCancellableDelay'
import { usePrev } from 'theme/utils/usePrev'
import { useStaticData } from 'vite-plugin-react-pages/dist/client'
import { SectionData } from './DocsFilter/getFindablePages'
import { scaleFrom } from './DocsFilter/scaleFrom'
import css from './SectionMenu.module.sass'

interface SectionMenuProps extends React.ComponentProps<'div'> {
  placeBelow?: boolean
  disabled?: boolean
}

export function SectionMenu(props: SectionMenuProps) {
  const page = usePage()
  const title = useStaticData<string>(page.path, data => data.main.title)
  const sections = useStaticData<SectionData | undefined>(
    page.path,
    data => data.main.sections
  )?.filter(
    // Hide <h3> sections.
    section => section[2] < 3
  )

  const mouseTimeout = useCancellableDelay()
  const onVisible = useChannel<boolean>()

  return !props.disabled && sections?.length ? (
    <div
      {...props}
      onMouseEnter={() => {
        mouseTimeout(() => {
          onVisible(true)
        }, 150)
      }}
      onMouseLeave={() => {
        mouseTimeout(() => {
          onVisible(false)
        }, 300)
      }}>
      {props.children}
      <Menu
        title={title}
        sections={sections}
        placeBelow={props.placeBelow}
        onVisible={onVisible}
      />
    </div>
  ) : null
}

interface MenuProps {
  title: string
  sections: SectionData
  placeBelow?: boolean
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
  const minScale = 0.4
  const style = useSpring({
    scale: visible ? 1 : minScale,
    opacity: visible ? 1 : 0,
    pointerEvents: (visible
      ? 'inherit'
      : 'none') as CSS.Properties['pointerEvents'],
    config: key => ({
      frequency: key == 'opacity' ? 0.2 : 0.25,
      damping: visible ? 1.08 : 1,
    }),
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
        key={i}
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
  const cursorStyle = useSpring({
    transform: computeCursorTransform(selectedIndex, props.sections),
    immediate: prevHidden,
    config: {
      frequency: 0.32,
      damping: 0.72,
    },
  })

  return (
    <a.div
      className={cn(
        css.menu,
        props.placeBelow ? 'top-82/100 -left-2.2' : '-top-1.1rem left-9/10'
      )}
      style={{
        ...style,
        scale: undefined,
        transform: style.scale.to(
          props.placeBelow ? scaleFrom(0.3, 0.075) : scaleFrom(-0.1, 0.1)
        ),
      }}>
      <div className="absolute w-full rounded-0.9rem">
        <div ref={scrollRef} className={css.content}>
          {!props.placeBelow && <div className={css.title}>{props.title}</div>}
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

function getLinkHeight(section: SectionData[number]) {
  return section[2 /* rank */] > 1 ? 2.1 : 2.6
}

function computeCursorTransform(selectedIndex: number, sections: SectionData) {
  let cursorY = 0
  if (selectedIndex < sections.length) {
    for (let i = 0; i < selectedIndex; i++) {
      cursorY += getLinkHeight(sections[i])
    }
    cursorY += getLinkHeight(sections[selectedIndex]) / 2
  }
  return `translateY(${cursorY}rem) translateY(-50%)`
}
