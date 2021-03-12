import { defineKnobs, defineCycle, defineRootStyle } from 'theme/demo'

export interface Props {
  trail: number
  visible: boolean
}

defineKnobs<Props>({
  trail: { init: 300 },
  visible: { init: true },
})

defineCycle<Props>((props, cycle) => [
  cycle.delay(props.visible ? 0 : 500),
  () => {
    props.visible = !props.visible
  },
  cycle.awaitAnimation(),
])

defineRootStyle({
  flexDirection: 'row',
})
