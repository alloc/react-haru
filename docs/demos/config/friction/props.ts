import { defineKnobs, defineCycle, defineRootStyle } from 'theme/demo'

export interface Props {
  friction: number
}

defineKnobs<Props>({
  friction: { init: 26, range: [0, 200] },
})

// defineCycle<Props>((props, cycle) => [
//   cycle.delay(props.visible ? 0 : 500),
//   () => {
//     props.visible = !props.visible
//   },
//   cycle.awaitAnimation(),
// ])

defineRootStyle({
  flexDirection: 'row',
})
