import { setFluidGetter, callFluidObservers } from 'fluids'
import React, { useEffect } from 'react'
import { useAsync } from 'react-async-hook'
import { Channel } from 'react-ch'
import { o } from 'wana'
import type { AppModule, ConfigModule, Demo, SourceModule } from './types'

import demoManifest from '@demos/manifest'
import { useValue } from 'theme/utils/useValue'
import { useCache } from 'theme/utils/useCache'

if (import.meta.hot) {
  let lastManifest = demoManifest
  setFluidGetter(demoManifest, () => lastManifest)

  import.meta.hot!.accept('/@demos/manifest.js', mod =>
    callFluidObservers(demoManifest, {
      type: 'change',
      parent: demoManifest,
      value: (lastManifest = mod.default),
    })
  )
}

export function useDemos() {
  return useValue(demoManifest)
}

const Context = React.createContext<Demo | null>(null)

// The "id" is assumed to be constant.
export function DemoContext({ id, ...props }: { id: string; children: any }) {
  const demos = useDemos()

  // Load the demo asynchronously.
  const { result } = useAsync(loadDemo, [id, demos], {
    onError: console.error,
  })

  // Cache the initial state.
  const demo = useCache(result && (() => createDemo(id, result)))

  // Apply hot-reloaded state.
  useEffect(() => {
    if (demo && result) {
      // Skip the App component, since Fast Refresh is used.
      const [src, , config] = result

      if (demo.code !== src.default) {
        demo.code = src.default
      }
      if (demo.knobs !== config.knobs) {
        demo.props = createProps(config)
        Object.assign(demo, config)
      }
    }
  }, [result])

  // Keep the previous tree rendered until hot-reloaded.
  const demoElem = <Context.Provider value={demo} {...props} />
  const cachedElem = useCache(result && (() => demoElem))
  return result ? demoElem : cachedElem
}

export function useDemo() {
  return React.useContext(Context)!
}

function loadDemo(id: string, demos: typeof demoManifest) {
  return demos[id] ? Promise.all(demos[id]()) : Promise.resolve(null)
}

function createDemo(
  id: string,
  [src, { App }, config]: [SourceModule, AppModule, ConfigModule]
): Demo {
  return o({
    id,
    ...config,
    App,
    code: src.default,
    codeVisible: false,
    props: createProps(config),
    cycle: null,
  })
}

function createProps({ knobs }: ConfigModule) {
  const props: any = {}
  for (const name in knobs) {
    const knob = knobs[name]
    if ('init' in knob) {
      props[name] = knob.init
    } else {
      props[name] =
        knob.type == 'toggle'
          ? false
          : knob.type == 'number'
          ? 0
          : knob.type == 'button'
          ? new Channel(name)
          : undefined
    }
  }
  return o(props)
}
