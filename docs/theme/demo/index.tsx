import { Pick } from '@alloc/types'
import React, { useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useInView } from 'react-intersection-observer'
import { style } from 'typestyle'
import { NestedCSSProperties } from 'typestyle/lib/types'
import { no, useChanges, watch, withAuto } from 'wana'
import { CodeBlock } from '../layout/mdx/CodeBlock'
import { useForceUpdate } from '../utils/useForceUpdate'
import { useTracker } from './useTracker'
import { ConfigModule, ResolveKnobType } from './types'
import { DemoContext, useDemo } from './DemoContext'
import { KnobMenu } from './KnobMenu'
import { AppCycle } from './AppCycle'

export function Demo({ id }: { id: string }) {
  const [inViewRef, inView] = useInView({
    delay: 2000,
    threshold: 0.1,
    triggerOnce: true,
  })

  const demo = useMemo(
    () =>
      inView && (
        <DemoContext id={id}>
          <DemoRoot />
        </DemoContext>
      ),
    [id, inView]
  )

  return (
    <div ref={inViewRef} className="demo">
      {demo}
    </div>
  )
}

function DemoRoot() {
  const demo = useDemo()
  if (!demo) {
    return null // TODO: loading component?
  }
  return (
    <>
      <div className="flex">
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
    <AppRoot>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={console.error}>
        <App props={{ ...no(props) }} tracker={tracker} />
        <AppCycle state={state} />
      </ErrorBoundary>
    </AppRoot>
  )
})

const AppRoot = withAuto((props: any) => {
  const demo = useDemo()

  const [inViewRef, inView] = useInView({ threshold: 0.01 })
  useEffect(() => {
    demo.cycle?.pause(!inView)
  }, [inView])

  const styleId = useMemo(() => {
    return style(appRootDefaultStyle, ...(demo.rootStyle || []))
  }, [demo.rootStyle])

  return (
    <div className="flex-1 pb-4.0">
      <div ref={inViewRef} className={styleId}>
        {props.children}
      </div>
      <div
        className="absolute left-0 bottom-0 text-0.8rem p-2.0 ml-2.0 mb-2.0 font-600 cursor-pointer select-none"
        onClick={() => {
          demo.codeVisible = !demo.codeVisible
        }}>
        {demo.codeVisible ? 'Hide' : 'Show'} code
      </div>
    </div>
  )
})

const SourceCode = withAuto(() => {
  const { code, codeVisible } = useDemo()
  return codeVisible ? (
    <div className={codeStyle}>
      <CodeBlock className="language-tsx">{code}</CodeBlock>
    </div>
  ) : null
})

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  const demo = useDemo()
  useChanges(demo, () => {
    resetErrorBoundary()
  })
  return (
    <div className="text-deepPink text-1.125rem font-520">
      ⚠️ {error.message}
    </div>
  )
}

//
// Styles
//

const appRootDefaultStyle: NestedCSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: '12.5rem',
  overflowY: 'scroll',
  borderTopLeftRadius: 'inherit',
  borderBottomLeftRadius: 'inherit',
}

const codeStyle = style({
  maxHeight: '30rem',
  overflow: 'scroll',
  borderTop: '1px solid #F4DEE3',
})

//
// Facade exports
//

type Omit<T, K extends string> = T extends infer U
  ? Pick<U, Exclude<keyof U, K>>
  : never

type KnobConfig<T> = Omit<ResolveKnobType<T>, 'type'>

declare function defineKnobs<Props>(
  knobs: { [P in keyof Props]?: KnobConfig<Props[P]> }
): void

declare function defineCycle<Props>(
  onCycle: ConfigModule<Props>['onCycle']
): void

declare const defineRootStyle: typeof style

export { defineKnobs, defineCycle, defineRootStyle }
