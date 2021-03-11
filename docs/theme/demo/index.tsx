import { UnknownProps } from '@alloc/types'
import React, { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { no, watch, withAuto } from 'wana'
import { CodeBlock } from '../layout/mdx/CodeBlock'
import { useForceUpdate } from '../utils/useForceUpdate'
import { useTracker } from './useTracker'
import { ConfigModule, ResolveKnobType } from './types'
import { DemoContext, useDemo } from './context'
import { KnobMenu } from './KnobMenu'
import { AppCycle } from './AppCycle'

export function Demo({ id, ...config }: { id: string } & UnknownProps) {
  // TODO: in case of scrolling past, delay ~500ms before loading the demo
  const [inViewRef, inView] = useInView({
    threshold: 0.5,
  })

  const demo = useMemo(
    () => (
      <DemoContext id={id}>
        <DemoRoot />
      </DemoContext>
    ),
    [id]
  )

  // TODO: preserve height when inView turns false
  return <div ref={inViewRef}>{inView && demo}</div>
}

function DemoRoot() {
  const demo = useDemo()
  if (!demo) {
    return null // TODO: loading component?
  }
  return (
    <>
      <div className="flex min-h-20.0">
        <AppContainer />
        <KnobMenu />
      </div>
      <SourceCode />
    </>
  )
}

const AppContainer = withAuto(() => {
  const { App, props } = useDemo()

  // Re-render when props are mutated.
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    const watcher = watch(props, forceUpdate)
    return () => {
      watcher.dispose()
    }
  }, [props])

  const [tracker, state] = useTracker()
  return (
    <div className="flex-1">
      <App props={no(props)} tracker={tracker} />
      <AppCycle state={state} />
    </div>
  )
})

const SourceCode = withAuto(() => {
  const { code } = useDemo()
  return <CodeBlock className="language-tsx">{code}</CodeBlock>
})

//
// Facade exports
//

declare const defineKnobs: <Props>(
  knobs: {
    [P in keyof Props]: Omit<ResolveKnobType<Props[P]>, 'type'>
  }
) => void

declare const defineCycle: <Props>(
  onCycle: ConfigModule<Props>['onCycle']
) => void

export { defineKnobs, defineCycle }
