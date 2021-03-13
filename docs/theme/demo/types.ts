import { Channel } from 'react-ch'
import { ControllerUpdate } from 'react-haru/web'
import { style } from 'typestyle'
import { Tracker } from './useTracker'

export {}

export type KnobProps<T = any> = Omit<T, 'type'> & {
  name: string
  value: KnobValue<T>
  setValue: (value: KnobValue<T>) => void
}

export type KnobValue<T> = T extends { init?: infer U }
  ? U
  : T extends ButtonType
  ? Channel
  : unknown

export interface ToggleType {
  type: 'toggle'
  init?: boolean
}

export interface NumberType {
  type: 'number'
  init?: number
}

export interface RangeType {
  type: 'range'
  init?: number
  range: [number, number]
}

export interface ButtonType {
  type: 'button'
  label: string
}

export type KnobType = ToggleType | NumberType | RangeType | ButtonType

export type ResolveKnobType<T> = [T] extends [boolean]
  ? ToggleType
  : [T] extends [number]
  ? NumberType | RangeType
  : [T] extends [Channel]
  ? ButtonType
  : unknown

export interface Cycle<Props = any> {
  cancelled: Boolean
  /** Pause or resume the cycle */
  pause: (paused: boolean) => void
  /** Resolve a promise after some time. */
  delay: (ms: number) => () => Promise<void>
  /** Returns a new promise that resolves when all controllers are idle. */
  awaitAnimation: () => () => Promise<void>
}

export interface Demo extends AppModule, ConfigModule {
  id: string
  code: string
  codeVisible: boolean
  props: any
  cycle: Cycle | null
}

export interface DemoLoader {
  (): [
    src: Promise<SourceModule>,
    app: Promise<AppModule>,
    config: Promise<ConfigModule>
  ]
}

/**
 * Raw source code wrapped in JSON string.
 */
export interface SourceModule {
  default: string
}

/**
 * Compiled demo component with Fast Refresh.
 */
export interface AppModule {
  App: React.ComponentType<{
    props: any
    tracker: Tracker
  }>
}

/**
 * Demo configuration.
 */
export interface ConfigModule<Props = any> {
  knobs?: { [name: string]: KnobType }
  onCycle?: (props: Props, cycle: Cycle<Props>) => (() => any)[]
  rootStyle?: Parameters<typeof style>
}
