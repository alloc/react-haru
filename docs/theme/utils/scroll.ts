import { raf } from 'rafz'
import { SpringConfig, SpringValue } from 'react-haru/web'

// Disable automated scroll restoration
history.scrollRestoration = 'manual'

const scrolls = [
  // Firefox and IE
  document.documentElement,
  // WebKit
  document.body,
]

export const scrollTop = new SpringValue(0, {
  config: { frequency: 1, precision: 1 },
  onChange(scrollTop) {
    nextScrollTop = scrollTop
    raf.write(updateScrollTop)
  },
})

let nextScrollTop = scrollTop.get()

function updateScrollTop() {
  scrolls.forEach(elem => (elem.scrollTop = nextScrollTop))
}

// Stop scroll animation on mouse scroll.
window.addEventListener('mousewheel', () => {
  scrollTop.stop()
})

export function scrollTo(elem: HTMLElement, config?: SpringConfig) {
  config = { frequency: 3, ...config }
  scrollTop.start(getOffsetTop(elem), { config })
}

function getOffsetTop(elem: HTMLElement) {
  return elem.getBoundingClientRect().top + scrollTop.get()
}

/**
 * Enable or disable scrolling of the document.
 *
 * Every call with `false` must be balanced by a call
 * with `true` before scrolling is re-enabled.
 */
export function setScrollEnabled(canScroll: boolean) {
  if (canScroll && !disableCount) return
  disableCount += canScroll ? -1 : 1
  if (disableCount == (canScroll ? 0 : 1)) {
    scrolls.forEach(scroll => {
      // Ignore mouse scrolling on desktop.
      scroll.classList[canScroll ? 'remove' : 'add']('no-scroll')
      // Ignore touch scrolling on mobile.
      const method = canScroll ? 'removeEventListener' : 'addEventListener'
      scroll[method]('touchmove', preventScroll, { passive: false })
    })
  }
}

// Disable scrolling unless this is zero.
let disableCount = 0

// Prevent scrolling of the document.
function preventScroll(event: Event) {
  const scroll = findScrollY(event.target as any)
  if (!scroll || scrolls.includes(scroll)) {
    event.preventDefault()
  }
}

// Find the nearest ancestor that is scrollable on the Y-axis.
function findScrollY(target: HTMLElement) {
  let elem: HTMLElement | null = target
  do {
    if (canScrollY(elem)) break
  } while ((elem = elem.parentElement))
  return elem
}

function canScrollY(elem: HTMLElement) {
  const height = elem.clientHeight
  return (
    height &&
    height < elem.scrollHeight &&
    /auto|scroll/.test(getComputedStyle(elem).overflowY)
  )
}
