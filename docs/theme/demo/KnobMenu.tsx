import React from 'react'
import { a, useSpring } from 'react-haru/web'
import { withAuto } from 'wana'
import { useDemo } from './context'
import { KnobProps, ToggleType } from './types'

export const KnobMenu = withAuto(() => {
  const demo = useDemo()
  const knobs = Object.keys(demo.knobs).map((name, i) => (
    <ReactiveKnob key={i} name={name} />
  ))
  return (
    <div
      onMouseEnter={() => demo.cycle?.pause(true)}
      onMouseLeave={() => demo.cycle?.pause(false)}>
      {knobs}
    </div>
  )
})

const ReactiveKnob = withAuto(({ name }: { name: string }) => {
  const demo = useDemo()!
  const { type, ...props } = demo.knobs[name]
  const Knob = knobTypes[type] as React.ComponentType<KnobProps>
  return (
    <div className="">
      <Knob
        {...props}
        name={name}
        value={demo.props[name]}
        setValue={value => {
          demo.props[name] = value
        }}
      />
    </div>
  )
})

const knobTypes = {
  toggle: ToggleKnob,
  number: () => null,
  button: () => null,
}

function ToggleKnob({ name, value, setValue }: KnobProps<ToggleType>) {
  const style = useSpring({
    x: (value ? 1 : 0) + 'rem',
    background: value ? 'green' : 'red',
  })
  return (
    <div className="flex items-center">
      <div className="mr-8.0">{name}</div>
      <div
        className="w-8.0 h-4.0 rounded-full border-1 border-black bg-rose3 cursor-pointer"
        onClick={() => setValue(!value)}>
        <a.div className="w-4.0 h-4.0 rounded-full" style={style} />
      </div>
    </div>
  )
}
