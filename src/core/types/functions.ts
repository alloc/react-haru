import { Lookup, Falsy } from '../../types'

import { Controller, ControllerQueue } from '../Controller'
import { SpringValue } from '../SpringValue'
import {
  SpringTo,
  InlineToProps,
  SpringChain,
  SpringProps,
  ControllerProps,
  GoalValue,
  GoalValues,
} from './props'
import { AsyncResult, AnimationResult } from './objects'
import { IsPlainObject } from './common'
import { Readable, InferProps, InferState, InferTarget } from './internal'

/** The flush function that handles `start` calls */
export type ControllerFlushFn<T extends Controller<any> = Controller> = (
  ctrl: T,
  queue: ControllerQueue<InferState<T>>
) => AsyncResult<T>

/**
 * An async function that can update or stop the animations of a spring.
 * Typically defined as the `to` prop.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
export interface SpringToFn<T = any> {
  (start: StartFn<T>, stop: StopFn<T>): Promise<any> | void
}

type StartFn<T> = InferTarget<T> extends { start: infer T } ? T : never
type StopFn<T> = InferTarget<T> extends { stop: infer T } ? T : never

/**
 * Update the props of an animation.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
export type SpringUpdateFn<T = any> = T extends IsPlainObject<T>
  ? UpdateValuesFn<T>
  : UpdateValueFn<T>

interface AnyUpdateFn<
  T extends SpringValue | Controller<any>,
  Props extends object = InferProps<T>,
  State = InferState<T>
> {
  (to: SpringTo<State>, props?: Props): AsyncResult<T>
  (props: { to?: SpringToFn<T> | Falsy } & Props): AsyncResult<T>
  (props: { to?: SpringChain<State> | Falsy } & Props): AsyncResult<T>
}

/**
 * Update the props of a `Controller` object or `useSpring` call.
 *
 * The `T` parameter must be a set of animated values (as an object type).
 */
interface UpdateValuesFn<State extends Lookup = Lookup>
  extends AnyUpdateFn<Controller<State>> {
  (props: InlineToProps<State> & ControllerProps<State>): AsyncResult<Controller<State>> // prettier-ignore
  (
    props: {
      to?: GoalValues<State> | Falsy
    } & ControllerProps<State>
  ): AsyncResult<Controller<State>>
}

/**
 * Update the props of a spring.
 *
 * The `T` parameter must be a primitive type for a single animated value.
 */
interface UpdateValueFn<T = any> extends AnyUpdateFn<SpringValue<T>> {
  (props: { to?: GoalValue<T> } & SpringProps<T>): AsyncResult<SpringValue<T>>
}

/**
 * Called before the first frame of every animation.
 * From inside the `requestAnimationFrame` callback.
 */
export type OnStart<T = unknown> = (spring: SpringValue<T>) => void

/** Called when a `SpringValue` changes */
export type OnChange<T = unknown> = (value: T, source: SpringValue<T>) => void

export type OnPause<T = unknown> = OnStart<T>
export type OnResume<T = unknown> = OnStart<T>

/** Called once the animation comes to a halt */
export type OnRest<T extends Readable = any> = (
  result: AnimationResult<T>
) => void

export type OnResolve<T = unknown> = (
  result: AnimationResult<Controller<T>>
) => void

/**
 * Called after an animation is updated by new props,
 * even if the animation remains idle.
 */
export type OnProps<T = unknown> = (
  props: Readonly<SpringProps<T>>,
  spring: SpringValue<T>
) => void