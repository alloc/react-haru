import { Lookup } from '@alloc/types'
import React, { useContext } from 'react'
import type { PagesStaticData } from 'vite-plugin-react-pages'
import { PathConfig } from '../config'

export interface PageData extends Lookup {
  main?: { title?: string; sourceType?: string } & Lookup
}

export interface PageContext<T = Lookup> {
  path: string
  page: T & PageData
  pages: PagesStaticData
  config: PathConfig
}

export const PageContext = React.createContext(null as PageContext | null)

export function usePage<T = Lookup>(path: string): (T & PageData) | undefined
export function usePage<T = Lookup>(): PageContext<T>
export function usePage(path?: string): any {
  const ctx = useContext(PageContext)
  if (ctx) {
    return path ? ctx.pages[path] : ctx
  }
  throw Error('usePage called outside PageContext')
}
