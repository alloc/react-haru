import { defineKnobs, defineCycle, defineRootStyle } from 'theme/demo'

export interface Props {
  tension: number
}

const tension = generateTension()

defineKnobs<Props>({
  tension: {
    init: next(tension),
    range: [0, 1000],
  },
})

defineCycle<Props>((props, cycle) => [
  cycle.delay(1500),
  () => {
    props.tension = next(tension)
  },
])

defineRootStyle({
  flexDirection: 'row',
})

function next<T>(gen: Generator<T>) {
  return gen.next().value
}

function* generateTension() {
  for (;;) {
    yield 250
    yield 500
    yield 1000
    yield 125
  }
}
