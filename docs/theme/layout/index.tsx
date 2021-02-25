import React from 'react'
import { Link } from 'react-router-dom'
import type { IPagesStaticData } from 'vite-plugin-react-pages'
import { ThemeConfig } from '../config'

import css from './style.module.sass'
import './global.sass'

interface Props {
  path: string
  pages: IPagesStaticData
  config: ThemeConfig
}

const Layout: React.FC<Props> = ({
  sideMenuData,
  topNavs,
  logo,
  path,
  children,
  footer,
  pagesStaticData,
  search,
}) => {
  return (
    <div>
      <div className={css.logo}>{logo}</div>
      <div className={css.content} key={path}>
        {children}
      </div>
    </div>
  )
}

export default Layout
