import { defineKnobs, defineCycle, defineRootStyle } from 'theme/demo'

export interface Props {
  expires: boolean
  visible: boolean
  reset: boolean
}

defineKnobs<Props>({
  expires: { init: false },
  visible: { init: true },
  reset: { init: false },
})

defineCycle<Props>((props, cycle) => [
  cycle.delay(800),
  () => {
    props.expires = !props.expires
  },
  cycle.delay(800),
  () => {
    props.visible = false
  },
  cycle.awaitAnimation(),
  cycle.delay(400),
  () => {
    props.visible = true
  },
  cycle.awaitAnimation(),
])

defineRootStyle({
  flexDirection: 'column',
})
