import { normalizeColor } from './normalizeColor'
import * as G from './globals'

export function colorToRgba(input: string) {
  let color: number | null = G.colors[input]
  if (color == null) {
    color = normalizeColor(input)
  }
  if (color === null) {
    return input
  }
  color = color || 0
  let r = (color & 0xff000000) >>> 24
  let g = (color & 0x00ff0000) >>> 16
  let b = (color & 0x0000ff00) >>> 8
  let a = (color & 0x000000ff) / 255
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
