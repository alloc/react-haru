import delay from 'delay'
import { useEffect } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { Controller, inferTo } from 'react-haru/web'
import { withAuto } from 'wana'
import { useDemo } from './DemoContext'
import { Cycle } from './types'
import { TrackedState } from './useTracker'

interface Props {
  state: TrackedState
}

export const AppCycle = withAuto(({ state }: Props) => {
  const demo = useDemo()
  const { onCycle, props } = demo

  useEffect(() => {
    if (onCycle) {
      const abortCtrl = new AbortController()
      demo.cycle = startCycle(onCycle, props, state, abortCtrl)
      return () => {
        demo.cycle = null
        abortCtrl.abort()
      }
    }
  }, [onCycle])

  return null
})

function startCycle(
  onCycle: Function,
  props: any,
  state: TrackedState,
  abortCtrl: AbortController
) {
  let paused = false
  let resume: () => void
  let resumePromise: Promise<void> | undefined
  let animator = new Controller()

  const cycle: Cycle = {
    get cancelled() {
      return abortCtrl.signal.aborted
    },
    pause(flag) {
      if (paused == flag) return
      paused = flag
      if (flag) {
        animator.stop()
        resumePromise = new Promise(resolve => {
          resume = resolve
        })
      } else {
        resumePromise = undefined
        resume()
      }
    },
    awaitAnimation() {
      return getIdlePromise
    },
    delay: ms => () =>
      delay(ms, {
        signal: abortCtrl.signal,
      }).catch(() => {
        throw cycle
      }),
  }

  async function getIdlePromise(): Promise<void> {
    await state.idlePromise
    if (cycle.cancelled) {
      throw cycle
    }
    if (state.active) {
      return getIdlePromise() // Loop until idle.
    }
  }

  async function loop(): Promise<void> {
    for (const action of onCycle(props, cycle)) {
      // Wait for cycle to be resumed.
      await resumePromise

      let result: any
      batchedUpdates(() => {
        result = action()
      })
      await result

      // Break out of loop if cancelled.
      if (cycle.cancelled) {
        throw cycle
      }
    }
    await loop()
  }

  loop().catch(err => {
    err !== cycle && console.error(err)
  })

  return cycle
}
