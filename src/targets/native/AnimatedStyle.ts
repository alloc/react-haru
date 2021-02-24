import { AnimatedObject } from 'react-haru'
import { AnimatedTransform } from './AnimatedTransform'

type Style = object & { transform?: any }

export class AnimatedStyle extends AnimatedObject {
  constructor(style: Style) {
    super(style)
  }

  setValue(style: Style) {
    super.setValue(
      style && style.transform
        ? { ...style, transform: new AnimatedTransform(style.transform) }
        : style
    )
  }
}
