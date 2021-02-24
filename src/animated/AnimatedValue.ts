import { is } from '../shared'
import { Animated, Payload } from './Animated'

/** An animated number or a native attribute value */
export class AnimatedValue<T = any> extends Animated {
  done = true
  elapsedTime!: number
  lastPosition!: number
  lastVelocity?: number | null
  v0?: number | null

  constructor(protected _value: T) {
    super()
    if (is.number(this._value)) {
      this.lastPosition = this._value
    }
  }

  /** @internal */
  static create(value: any) {
    return new AnimatedValue(value)
  }

  getPayload(): Payload {
    return [this]
  }

  getValue() {
    return this._value
  }

  setValue(value: T, step?: number) {
    if (is.number(value)) {
      this.lastPosition = value
      if (step) {
        value = (Math.round(value / step) * step) as any
        if (this.done) {
          this.lastPosition = value as any
        }
      }
    }
    if (this._value === value) {
      return false
    }
    this._value = value
    return true
  }

  reset() {
    const { done } = this
    this.done = false
    if (is.number(this._value)) {
      this.elapsedTime = 0
      this.lastPosition = this._value
      if (done) this.lastVelocity = null
      this.v0 = null
    }
  }
}