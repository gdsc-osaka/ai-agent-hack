import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";

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

export const asyncify = <T, E>(result: Result<T, E>): ResultAsync<T, E> => {
  return result.match(
    (ok) => okAsync(ok),
    (err) => errAsync(err)
  );
};

/**
 * Immediately Invoked Function Expression: 即時実行関数式
 * if, try, switch 文などを即時実行し, 擬似的に式として扱うことができるようにする.
 * @param f
 * @example
 * ```typescript
 * const result = iife(() => {
 *   if (condition) {
 *     return "foo";
 *   } else {
 *     return "bar";
 *   }
 * }
 * ```
 */
export const iife = <T>(f: () => T): T => f();
