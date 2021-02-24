import { is, isAnimatedString } from '../shared'
import { AnimatedType } from './types'
import { AnimatedArray } from './AnimatedArray'
import { AnimatedString } from './AnimatedString'
import { AnimatedValue } from './AnimatedValue'
import { getAnimated } from './Animated'

/** Return the `Animated` node constructor for a given value */
export function getAnimatedType(value: any): AnimatedType {
  const parentNode = getAnimated(value)
  return parentNode
    ? (parentNode.constructor as any)
    : is.array(value)
    ? AnimatedArray
    : isAnimatedString(value)
    ? AnimatedString
    : AnimatedValue
}
