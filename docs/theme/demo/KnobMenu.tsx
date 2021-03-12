import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { a, useSpring } from 'react-haru/web'
import Input from 'react-input-autosize'
import { withAuto } from 'wana'
import { useDemo } from './DemoContext'
import { KnobProps, NumberType, ToggleType } from './types'

export const KnobMenu = withAuto(() => {
  const demo = useDemo()
  const knobs = Object.keys(demo.knobs).map((name, i) => (
    <ReactiveKnob key={i} name={name} />
  ))
  return (
    <div
      className="self-stretch overflow-y-scroll select-none"
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
    <Knob
      {...props}
      name={name}
      value={demo.props[name]}
      setValue={value => {
        demo.props[name] = value
      }}
    />
  )
})

const knobTypes = {
  toggle: ToggleKnob,
  number: NumberKnob,
  button: () => null,
}

function ToggleKnob({ name, value, setValue }: KnobProps<ToggleType>) {
  const style = useSpring({
    x: (value ? 1 : 0) + 'rem',
    background: value ? 'green' : 'red',
    config: {
      frequency: 0.38,
    },
  })
  return (
    <div className="flex items-center p-2.0">
      <div className="flex-1 mr-8.0">{name}</div>
      <div
        className="w-8.0 h-4.0 rounded-full border-1 border-black bg-rose3 cursor-pointer"
        onClick={() => setValue(!value)}>
        <a.div className="w-4.0 h-4.0 rounded-full" style={style} />
      </div>
    </div>
  )
}

function NumberKnob({ name, value, setValue }: KnobProps<NumberType>) {
  const [text, setText] = useState(String(value))

  // Handle scripted changes.
  useLayoutEffect(() => {
    if (value !== Number(text)) {
      setText(String(value))
    }
  }, [value])

  return (
    <div className="flex items-center p-2.0">
      <div className="flex-1 mr-8.0">{name}</div>
      <Input
        inputClassName="px-2.0 rounded-0.6rem border-deepPink3 outline-none"
        value={text}
        onChange={e => {
          const { value } = e.target
          if (value !== text) {
            setText(value)
            setValue(Number(value))
          }
        }}
      />
    </div>
  )
}
