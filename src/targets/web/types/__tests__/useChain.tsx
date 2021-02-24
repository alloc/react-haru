import { test } from 'spec.ts';
import { SpringRef } from 'react-haru';
import { useChain } from '../..';

const refs: SpringRef[] = [];

test('basic usage', () => {
  // No timesteps
  useChain(refs);

  // With timesteps
  useChain(refs, [0, 1]);

  // Cut timesteps in half
  useChain(refs, [0, 1], 1000 / 2);
});
