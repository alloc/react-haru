import React from 'react'
import type { PagesStaticData } from 'vite-plugin-react-pages'
import { ThemeConfig } from '../config'
import { Title } from './title'

import './global.sass'

interface Props {
  path: string
  page: any
  pages: PagesStaticData
  config: ThemeConfig
}

const Layout: React.FC<Props> = ({ path, page, config, children }) => {
  const { title, sourceType } = page.main!
  return (
    <div className="min-h-100vh">
      <div className="position-absolute"></div>
      <div className="-sm:w-95/100 w-8/10 max-w-900px mx-auto" key={path}>
        {/* {title && <h1>{title}</h1>} */}
        {title && <Title text={title} />}
        {children}
      </div>
    </div>
  )
}

export default Layout
