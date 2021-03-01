import React, { Children, ReactHTML, ReactNode } from 'react'
import { a, SpringValue } from 'react-haru/web'
import { isElement } from 'react-is'
import Slugger from 'github-slugger'
import css from './Heading.module.sass'
import { copyLink } from '../Header'

const slugger = new Slugger()

export const makeHeading = (Tag: keyof ReactHTML) => (props: any) => {
  const slug = slugger.slug(stringifyChildren(props.children))
  return (
    <Tag
      id={slug}
      className={css.heading}
      onMouseEnter={() => {
        scale.start({ from: 0.6, to: 1 })
        rotateZ.start({ from: -25, to: 0 })
      }}>
      <div className="w-20px h-20px bg-red" />
      <a href={'#' + slug} {...anchorEvents}>
        <a.span style={{ scale, rotateZ }}>§</a.span>
      </a>
      {props.children}
    </Tag>
  )
}

// Share springs between anchors, since only one shows at a time.
const scale = new SpringValue(1, {
  config: { frequency: 0.4 },
})
const rotateZ = new SpringValue(0, {
  config: { frequency: 0.8, damping: 0.4 },
})

const anchorEvents = {
  onMouseDown() {
    scale.start(0.8)
  },
  onMouseUp() {
    scale.start(1, { delay: 80, config: { frequency: 0.3 } })
  },
  onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    rotateZ.start(360, {
      onRest: ({ finished }) => finished && rotateZ.set(0),
    })
    copyLink(event.currentTarget.href)
  },
}

function stringifyChildren(children: ReactNode): string {
  return Children.toArray(children).reduce<string>((text, child) => {
    if (isElement(child)) {
      child = stringifyChildren(child.props.children)
    }
    return text + (child == null ? '' : child)
  }, '')
}

if (import.meta.hot) {
  import.meta.hot!.accept(mod => {
    console.log(mod)
  })
}
