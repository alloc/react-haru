import {
  colors,
  createHost,
  createStringInterpolator,
  Globals,
} from 'react-haru'
import { unstable_batchedUpdates } from 'react-dom'
import { applyAnimatedValues } from './applyAnimatedValues'
import { AnimatedStyle } from './AnimatedStyle'
import { WithAnimated } from './animated'
import { primitives } from './primitives'

Globals.assign({
  batchedUpdates: unstable_batchedUpdates,
  createStringInterpolator,
  colors,
})

const host = createHost(primitives, {
  applyAnimatedValues,
  createAnimatedStyle: style => new AnimatedStyle(style),
  getComponentProps: ({ scrollTop, scrollLeft, ...props }) => props,
})

export const animated = host.animated as WithAnimated
export { animated as a }

export * from './animated'
export * from 'react-haru'
