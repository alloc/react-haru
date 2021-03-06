import { Lookup } from '@alloc/types'
import React, { useContext } from 'react'
import { PageConfig } from '../config'

const PageContext = React.createContext(null as PageConfig | null)

export interface PageData extends Lookup {
  main?: { title?: string; sourceType?: string } & Lookup
}

export const PageProvider = PageContext.Provider

export function usePage() {
  return useContext(PageContext)!
}
