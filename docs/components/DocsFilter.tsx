import cn from 'classnames'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { a, useSpring, CSS, useTransition } from 'react-haru/web'
import { useLocation } from 'react-router-dom'
import { useChannel, Channel } from 'react-ch'
import { useHotkeys } from 'react-hotkeys-hook'
import toPixels from 'to-px'
import useClickOutside from 'use-click-outside'
import type { PagesStaticData } from 'vite-plugin-react-pages'
import { Anchor } from 'theme/layout/mdx/Anchor'
import { Attraction } from 'theme/utils/Attraction'
import { limitCalls } from 'theme/utils/limitCalls'
import { useFuse } from 'theme/utils/useFuse'
import { useHeight } from 'theme/utils/useHeight'
import { usePrev } from 'theme/utils/usePrev'
import { useCancellableDelay } from 'theme/utils/useCancellableDelay'
import css from './DocsFilter.module.sass'
import { useStaticData } from 'vite-plugin-react-pages/dist/client'

// Note: This assumes only one DocsFilter ever exists.
const global = { animating: 0 }

export function DocsFilter() {
  const [menuVisible, setMenuVisible] = useState(false)

  useHotkeys('cmd+k', () => setMenuVisible(visible => !visible), {
    enableOnTags: ['INPUT'],
  })

  const hideMenu = () => setMenuVisible(false)
  useHotkeys('escape', hideMenu, { enableOnTags: ['INPUT'] })

  const menuRef = useRef<HTMLDivElement>(null)
  useClickOutside(menuRef, hideMenu)

  const leaveTimeout = useCancellableDelay()
  return (
    <div
      className="flex items-center cursor-default"
      onMouseEnter={() => {
        leaveTimeout.cancel()
        setMenuVisible(true)
      }}
      onMouseLeave={() =>
        !global.animating &&
        leaveTimeout(() => {
          // setMenuVisible(false)
        }, 300)
      }>
      <Attraction className="flex items-center">
        Docs
        <img src="/down.svg" className="w-2.4 ml-1.2 mt-0.6" />
      </Attraction>
      <Menu
        ref={menuRef}
        visible={menuVisible}
        onClick={() => {
          setMenuVisible(false)
        }}
      />
    </div>
  )
}

// The padding before/after the search results
const contentPaddingTop = 1.2
const contentPaddingBottom = 0.8

// The height of a search result multiplied by the given count
const getContentHeight = (count: number, padding = 0) =>
  2.65 * count + padding + 'rem'

interface MenuProps {
  visible: boolean
  onClick: () => void
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ visible, onClick }, menuRef) => {
    const menuStyle = useSpring({
      x: visible ? '-50%' : '-52%',
      y: visible ? 0 : -8,
      z: 0, // Give the menu its own layer.
      opacity: visible ? 1 : 0,
      // Translate before/after scaling to adjust the anchor point.
      transform: `translateY(-50%) scale(${
        visible ? 1 : 0.92
      }) translateY(50%)`,
      config: key => ({
        frequency: key == 'opacity' ? 0.2 : 0.25,
      }),
      // Clear the search once hidden.
      onRest: ({ finished }) => !visible && finished && clearInput(),
    })

    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
      const input = inputRef.current
      if (input) {
        if (visible) {
          input.focus()
        } else {
          input.blur()
        }
      }
    }, [visible])

    function clearInput() {
      onSearch((inputRef.current!.value = ''))
    }

    const onSearch = useChannel<string>()
    return (
      <a.div
        ref={menuRef}
        className={css.menu}
        style={{
          ...menuStyle,
          pointerEvents: visible ? 'auto' : 'none',
        }}>
        <div className={cn(css.menuBorder, 'fill')} />
        <div className="flex h-13.2 w-1/1 text-1rem font-440">
          <img src="/search.svg" className="h-5.0 mt-0.55 ml-4.6 self-center" />
          <div className="absolute h-1/1 right-6.0 flex items-center">
            <img src="/command.svg" className="h-3.0" />
            <div
              className="font-600 ml-0.6 text-0.9rem"
              style={{ color: '#CFB8BE' }}>
              K
            </div>
          </div>
          <input
            ref={inputRef}
            spellCheck={false}
            className="fill pl-12.0"
            placeholder="Filter list..."
            onInput={e => onSearch(e.currentTarget.value)}
          />
        </div>
        <Results visible={visible} onClick={onClick} onSearch={onSearch} />
      </a.div>
    )
  }
)

const getFindablePages = (pages: PagesStaticData) =>
  Object.entries(pages).filter(({ 1: { main } }) => main.title && !main.hidden)

const Results = React.memo(
  (props: {
    visible: boolean
    onClick: () => void
    onSearch: Channel<string>
  }) => {
    const pages = useStaticData()
    const findablePages = useMemo(() => getFindablePages(pages), [pages])
    const [searchResults, search] = useFuse(findablePages, {
      keys: ['0', '1.main.title'],
      threshold: 0.3,
      findAllMatches: true,
      matchAllIfEmpty: true,
    })

    // Trigger search from parent component.
    useChannel(props.onSearch, limitCalls(search, 200))

    const getResultY = (result: any) =>
      getContentHeight(searchResults.indexOf(result), contentPaddingTop)

    const resultCount = searchResults.length
    const prevResultCount = usePrev(resultCount)

    const [renderPages] = useTransition(
      searchResults,
      {
        key: result => result.item[0],
        enter: result => ({
          zIndex: 1,
          translateY: getResultY(result),
          pointerEvents: 'unset' as CSS.Properties['pointerEvents'],
          opacity: 1,
          display: 'block',
          delay: key => (key == 'opacity' && prevResultCount == 0 ? 200 : 0),
          immediate: !props.visible || 'translateY',
        }),
        update: result => ({
          translateY: getResultY(result),
        }),
        leave: [
          {
            zIndex: 0,
            pointerEvents: 'none' as CSS.Properties['pointerEvents'],
            opacity: 0,
          },
          {
            // Prevent hidden items from affecting content height.
            display: 'none',
          },
        ],
        lead: 'leave',
        config: () => key => ({
          frequency: key == 'opacity' ? 0.3 : 0.5,
        }),
        immediate: !props.visible,
        expires: false,
        onStart() {
          global.animating++
        },
        onRest() {
          global.animating--
        },
      },
      [searchResults]
    )

    const [notFoundRef, notFoundHeight] = useHeight()
    const notFoundStyle = useSpring({
      from: { opacity: 0, display: 'none' as CSS.Properties['display'] },
      to: resultCount
        ? [{ opacity: 0 }, { display: 'none' }]
        : { opacity: 1, display: 'block' as CSS.Properties['display'] },
      delay: resultCount ? 0 : 200,
      config: {
        frequency: 0.2,
      },
    })
    const openIssueRef = useRef<HTMLAnchorElement>(null)
    const notFound = (
      <a.div ref={notFoundRef} className={css.notFound} style={notFoundStyle}>
        <div>
          Can't find what you're <br />
          looking for?
        </div>
        <Anchor
          ref={openIssueRef}
          href="https://github.com/alloc/react-haru/issues/new">
          Open an issue
        </Anchor>
        <img src="/accent1.svg" className="absolute bottom-0 right-0 w-24.0" />
      </a.div>
    )

    const contentHeight = getContentHeight(
      resultCount,
      contentPaddingTop + contentPaddingBottom
    )

    const maxScrollHeight = toPixels(getContentHeight(9.5, contentPaddingTop))
    const scrollHeight = resultCount
      ? Math.min(toPixels(contentHeight), maxScrollHeight)
      : notFoundHeight

    const scrollStyle = useSpring({
      height: scrollHeight,
      immediate: !props.visible,
      config: { frequency: 0.6 },
    })

    const [selectedIdx, setSelectedIdx] = useState(0)
    const anchors: HTMLAnchorElement[] = []

    function clickSelection() {
      if (resultCount > 0) anchors[selectedIdx].click()
      else openIssueRef.current!.click()
    }
    function selectNext(event: KeyboardEvent) {
      setSelectedIdx(idx => Math.min(idx + 1, resultCount - 1))
      event.preventDefault()
    }
    function selectPrevious(event: KeyboardEvent) {
      setSelectedIdx(idx => Math.max(idx - 1, 0))
      event.preventDefault()
    }
    function resetSelection() {
      if (resultCount > 0) setSelectedIdx(0)
    }

    useHotkeys('enter', clickSelection, { enableOnTags: ['INPUT'] })
    useHotkeys('down', selectNext, { enableOnTags: ['INPUT'] })
    useHotkeys('up', selectPrevious, { enableOnTags: ['INPUT'] })
    useLayoutEffect(resetSelection, [searchResults])

    const location = useLocation()
    const pageLinks = renderPages((style, result) => {
      const [path, page] = result.item
      const { title } = page.main
      const index = searchResults.indexOf(result)
      const isSelected = index === selectedIdx
      const isCurrentPage = path === location.pathname
      return (
        <a.div
          className="absolute rotate-0.01 w-1/1"
          style={style}
          onMouseMove={() => !isSelected && setSelectedIdx(index)}>
          <Anchor
            ref={elem => elem && (anchors[index] = elem)}
            href={path}
            className="block w-1/1 h-9.6 mb-1.0 px-4.8"
            onClick={props.onClick}>
            <span
              className={cn(
                'flex items-center pl-2.4 w-1/1 h-1/1 text-1.04rem text-black font-460 overflow-hidden',
                isCurrentPage && css.currentPage,
                isSelected && css.selectedResult
              )}>
              {title}
              {isSelected && (
                <div className="absolute right-0 w-0.8 h-1/1 bg-red" />
              )}
            </span>
          </Anchor>
        </a.div>
      )
    })

    return (
      <div>
        {notFound}
        <a.div className={css.content} style={scrollStyle}>
          <div
            className="flex flex-1 flex-col"
            style={{ height: contentHeight }}>
            {pageLinks}
          </div>
        </a.div>
      </div>
    )
  }
)
