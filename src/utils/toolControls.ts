export function repeat(repeatCount: number): ReadonlyArray<number> {
  if (repeatCount < 0 || !Number.isInteger(repeatCount)) {
    throw new Error('Repeat number should be positive integer');
  }
  return Array.from({ length: repeatCount }, (val, index) => index);
}

export function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function unwrap<T>(value: unknown, assertion: string): T {
  if (typeof value === 'undefined' || value === null) {
    throw new Error(assertion);
  }
  return <T>value;
}

export function mod(value: number, module: number): number {
  const modExpression = ((value % module) + module) % module;
  return modExpression === -0 ? 0 : modExpression;
}

export function roundToNearest(value: number, multiple: number): number {
  // todo
  const roundToNearestExpression =
    value <= 0 ? Math.floor(value / multiple) * multiple : Math.ceil(value / multiple) * multiple;
  // const roundToNearestExpression = Math.ceil(value / multiple) * multiple;
  return roundToNearestExpression === -0 ? 0 : roundToNearestExpression;
}

export function resolveAll<T>(promises: ReadonlyArray<Promise<T>>): Promise<void> {
  return new Promise<void>((resolve) => Promise.all(promises).then(() => resolve()));
}
