import { useState } from 'react'
import { Lookup } from '../types'
import { SpringRef } from '../core/SpringRef'

const initSpringRef = () => new SpringRef<any>()

export const useSpringRef = <State extends Lookup = Lookup>() =>
  useState(initSpringRef)[0] as SpringRef<State>
