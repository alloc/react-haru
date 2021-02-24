import { Valid } from '../core/types/common'
import { TransitionComponentProps } from '../core/types'
import { useTransition } from '../hooks'

export function Transition<
  Item extends any,
  Props extends TransitionComponentProps<Item>
>(
  props:
    | TransitionComponentProps<Item>
    | (Props & Valid<Props, TransitionComponentProps<Item, Props>>)
): JSX.Element

export function Transition({
  items,
  children,
  ...props
}: TransitionComponentProps<any>) {
  return useTransition(items, props)(children)
}
