/**
 * Picks the first `ResultAsync` from an array of `ResultAsync` instances.
 * @example
 * ...
 * .andThen((foo) => ResultAsync.combine([f1(foo), f2(foo)]))
 * .map(pickFirst)
 * .andThen((resultOfF1) => ...)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pickFirst = <T>([first]: [T, ...any[]]): T => {
  return first;
};

export const voidify = (): void => {
  return undefined;
};
