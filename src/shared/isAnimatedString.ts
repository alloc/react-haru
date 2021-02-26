import { is } from '@alloc/is'
import { colors } from './globals'

// Not all strings can be animated (eg: {display: "none"})
export const isAnimatedString = (value: unknown): value is string =>
  is.string(value) &&
  (value[0] == '#' || /\d/.test(value) || value in (colors || {}))
