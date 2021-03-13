import { inferTo } from './helpers'
import { ReservedProps } from './types/props'

describe('helpers', () => {
  it('interpolateTo', () => {
    const forwardProps = {
      result: 'ok',
    }
    const restProps = {
      from: 'from',
      config: 'config',
      onStart: 'onStart',
    }
    const excludeProps: Required<ReservedProps> = {
      config: undefined,
      from: undefined,
      to: undefined,
      ref: undefined,
      loop: undefined,
      reset: undefined,
      pause: undefined,
      cancel: undefined,
      reverse: undefined,
      immediate: undefined,
      default: undefined,
      delay: undefined,
      onPause: undefined,
      onProps: undefined,
      onStart: undefined,
      onChange: undefined,
      onRest: undefined,
      onResume: undefined,
      onResolve: undefined,
      keys: undefined,
      parentId: undefined,
    }
    expect(
      inferTo({
        ...forwardProps,
        ...restProps,
        ...excludeProps,
      })
    ).toMatchObject({
      to: forwardProps,
      ...restProps,
      ...excludeProps,
    })
  })
})
