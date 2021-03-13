import React, { useLayoutEffect, useState } from 'react'
import { a, useSpring } from 'react-haru/web'
import Input from 'react-input-autosize'
import { useDrag } from 'react-use-gesture'
import { useElementSize } from 'use-element-size'
import { withAuto } from 'wana'
import { useDemo } from './DemoContext'
import { KnobProps, NumberType, RangeType, ToggleType } from './types'

export const KnobMenu = withAuto(() => {
  const demo = useDemo()
  const knobs =
    demo.knobs &&
    Object.keys(demo.knobs).map((name, i) => (
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
  const { props, knobs } = useDemo()
  const { type, ...config } = knobs![name]
  const Knob = knobTypes[type] as React.ComponentType<KnobProps>
  return (
    <Knob
      {...config}
      name={name}
      value={props[name]}
      setValue={value => {
        props[name] = value
      }}
    />
  )
})

const knobTypes = {
  toggle: ToggleKnob,
  number: NumberKnob,
  range: RangeKnob,
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

function RangeKnob({
  name,
  range: [min, max],
  value,
  setValue,
}: KnobProps<RangeType>) {
  const [width, setWidth] = useState(0)
  const x = width * ((value - min) / (max - min))

  const config = {
    frequency: 0.4,
  }

  const dragStyle = useSpring({ x, config })
  const drag = useDrag(
    state => {
      const [x] = state.movement
      setValue(round(min + (x / width) * (max - min), 10))
    },
    {
      initial: [x, 0],
      bounds: { left: 0, right: width },
    }
  )

  const { text } = useSpring({
    text: value,
    config: { ...config, round: 1 },
  })

  const widthRef = useElementSize(size => size && setWidth(size.width))
  return (
    <div>
      <div className="flex items-center p-2.0">
        <div className="flex-1 mr-8.0">{name}</div>
        <a.div className="w-16.0 text-right font-mono">{text}</a.div>
      </div>
      <div
        ref={widthRef}
        className="flex-1 h-0.4 rounded-full bg-deepPink3 mt-2.5 mx-4.0">
        <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
          <a.div
            className="w-4.0 h-4.0 rounded-full bg-white shadow-md cursor-pointer"
            style={dragStyle}
            {...drag()}
          />
        </div>
      </div>
    </div>
  )
}

function round(n: number, step = 1) {
  return Math.round(n / step) * step
}
