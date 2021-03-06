import Slugger from 'github-slugger'
import { useRef } from 'react'

let slugger = new Slugger()
let lastVersion = 1

export function useSlug(value: string) {
  // The caller is expected to re-render only on Fast Refresh.
  const versionRef = useRef(lastVersion - 1)
  const version = ++versionRef.current

  // ..which prompts us to reset the Slugger.
  if (version !== lastVersion) {
    lastVersion = version
    slugger.reset()
  }

  return slugger.slug(value)
}
