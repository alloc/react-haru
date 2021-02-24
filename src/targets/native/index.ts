import { is } from '@alloc/is'
import { StyleSheet } from 'react-native'
import {
  colors,
  createHost,
  createStringInterpolator,
  Globals,
  AnimatedObject,
} from 'react-haru'
import { primitives } from './primitives'
import { WithAnimated } from './animated'
import { AnimatedStyle } from './AnimatedStyle'

Globals.assign({
  batchedUpdates: require('react-native').unstable_batchedUpdates,
  createStringInterpolator,
  colors,
})

const host = createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (is.undefined(props.children) && instance.setNativeProps) {
      instance.setNativeProps(props)
      return true
    }
    return false
  },
  createAnimatedStyle(styles) {
    styles = StyleSheet.flatten(styles)
    if (is.plainObject(styles.shadowOffset)) {
      styles.shadowOffset = new AnimatedObject(styles.shadowOffset)
    }
    return new AnimatedStyle(styles)
  },
})

export const animated = host.animated as WithAnimated
export { animated as a }

export * from './animated'
export * from 'react-haru'
