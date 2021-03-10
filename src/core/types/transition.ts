import { ReactNode } from 'react'
import {
  Lookup,
  ObjectFromUnion,
  ObjectType,
  Constrain,
  OneOrMore,
  UnknownProps,
  Merge,
  Falsy,
  NoInfer,
} from '../../types'

import {
  AnimationProps,
  ControllerProps,
  ControllerUpdate,
  ForwardProps,
  GoalProp,
  PickAnimated,
  SpringChain,
} from './props'
import { SpringToFn } from './functions'
import { SpringValues, SpringConfig } from './objects'
import { TransitionPhase } from '../TransitionPhase'
import { Controller } from '../Controller'
import { SpringRef } from '../SpringRef'

/** The phases of a `useTransition` item */
export type TransitionKey = 'initial' | 'enter' | 'update' | 'leave'

/**
 * Extract a union of animated values from a set of `useTransition` props.
 */
export type TransitionValues<Props extends object> = unknown &
  ForwardProps<
    ObjectFromUnion<
      Constrain<
        ObjectType<
          Props[TransitionKey & keyof Props] extends infer T
            ? T extends ReadonlyArray<infer Element>
              ? Element
              : T extends (...args: any[]) => infer Return
              ? Return extends ReadonlyArray<infer ReturnElement>
                ? ReturnElement
                : Return
              : T
            : never
        >,
        {}
      >
    >
  >

export type UseTransitionProps<Item = any> = Merge<
  ControllerProps<UnknownProps>,
  {
    from?: TransitionFrom<Item>
    initial?: TransitionFrom<Item>
    enter?: TransitionTo<Item>
    update?: TransitionTo<Item>
    leave?: TransitionTo<Item>
    key?: ItemKeys<Item>
    sort?: (a: Item, b: Item) => number
    trail?: number
    onProps?: (
      props: ControllerProps,
      item: Item,
      phase: Exclude<TransitionPhase, 'mount'>
    ) => void
    /**
     * When true, existing items have their transitions recreated,
     * and leaving items are unmounted.
     */
    reset?: boolean
    /**
     * Skipped items are never rendered.
     */
    skip?: (item: Item, key: unknown) => boolean
    /**
     * Leading animations must end before other animations can start.
     *
     * This prop __must__ be constant.
     *
     * For example, use `lead: "leave"` to have items exit before
     * other items can enter.
     */
    lead?: 'leave' | Falsy
    /**
     * When `true` or `<= 0`, each item is unmounted immediately after its
     * `leave` animation is finished.
     *
     * When `false`, items are never unmounted.
     *
     * When `> 0`, this prop is used in a `setTimeout` call that forces a
     * rerender if the component that called `useTransition` doesn't rerender
     * on its own after an item's `leave` animation is finished.
     */
    expires?: boolean | number | ((item: Item) => boolean | number)
    config?:
      | SpringConfig
      | ((item: Item, index: number) => AnimationProps['config'])
    /**
     * Called after a transition item is unmounted.
     */
    onDestroyed?: (item: Item, key: unknown) => void
    /**
     * Used to access the imperative API.
     *
     * Animations never auto-start when `ref` is defined.
     */
    ref?: SpringRef
  }
>

export type TransitionComponentProps<
  Item,
  Props extends object = any
> = unknown &
  UseTransitionProps<Item> & {
    keys?: ItemKeys<NoInfer<Item>>
    items: OneOrMore<Item>
    children: TransitionRenderFn<NoInfer<Item>, PickAnimated<Props>>
  }

export type ItemKeys<T = any> = ((item: T) => any) | null

/** The function returned by `useTransition` */
export interface TransitionFn<Item = any, State extends Lookup = Lookup> {
  (render: TransitionRenderFn<Item, State>): JSX.Element
}

export interface TransitionRenderFn<Item = any, State extends Lookup = Lookup> {
  (
    values: Readonly<SpringValues<State>>,
    item: Item,
    index: number,
    phase: Exclude<TransitionPhase, 'mount'>,
    ctrl: Controller<State>
  ): ReactNode
}

export interface TransitionState<Item = any, State extends Lookup = Lookup> {
  key: any
  item: Item
  ctrl: Controller<State>
  phase: TransitionPhase
  expired?: boolean
  expirationId?: number
}

export type TransitionFrom<Item> =
  | Falsy
  | GoalProp<UnknownProps>
  | ((item: Item, index: number) => GoalProp<UnknownProps> | Falsy)

export type TransitionTo<Item, State extends Lookup = Lookup> =
  | Falsy
  | OneOrMore<ControllerUpdate<State>>
  | Function // HACK: Fix inference of untyped inline functions.
  | ((
      item: Item,
      index: number
    ) =>
      | ControllerUpdate<State>
      | SpringChain<State>
      | SpringToFn<State>
      | Falsy)

export interface Change {
  phase: TransitionPhase
  springs: SpringValues<UnknownProps>
  payload: ControllerUpdate
}
