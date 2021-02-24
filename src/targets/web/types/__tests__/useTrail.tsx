import { assert, test, _ } from 'spec.ts';
import { SpringValues } from 'react-haru';

import { useTrail } from '../..';

test('basic usage', () => {
  const springs = useTrail(3, { opacity: 1 });
  assert(
    springs,
    _ as Array<
      SpringValues<{
        opacity: number;
      }>
    >
  );
});

test('function argument', () => {
  const [springs, set, stop] = useTrail(3, () => ({ opacity: 1 }));
  assert(
    springs,
    _ as Array<
      SpringValues<{
        opacity: number;
      }>
    >
  );
  assert(
    set,
    _ as SpringStartFn<{
      opacity: number;
    }>
  );
  assert(stop, _ as SpringStopFn<{}>);
});
