import { defineKnobs, defineCycle, defineRootStyle } from 'theme/demo'

export interface Props {
  trail: number
  visible: boolean
}

defineKnobs<Props>({
  trail: { init: 200 },
  visible: { init: true },
})

defineCycle<Props>((props, cycle) => [
  cycle.delay(props.visible ? 0 : 500),
  () => {
    props.visible = !props.visible
    if (props.visible) {
      props.trail += 200
      if (props.trail > 800) {
        props.trail = 200
      }
    }
  },
  cycle.awaitAnimation(),
])

defineRootStyle({
  flexDirection: 'row',
})
