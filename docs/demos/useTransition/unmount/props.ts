import { defineKnobs, defineCycle } from 'theme/demo'

export interface Props {
  visible: boolean
}

defineKnobs<Props>({
  visible: { init: true },
})

defineCycle<Props>((props, cycle) => [
  cycle.delay(1000),
  () => {
    // props.visible = !props.visible
  },
  cycle.awaitAnimation(),
])
