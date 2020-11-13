/**
 * `map :: (a -> b) -> [a] -> [b]`
 *
 * Calls a defined callback function on each element of an array, and returns an
 * array that contains the results.
 */
export const map = <A, B> (f: (x: A) => B) => (xs: A[]): B[] => xs .map (f)


/**
 * `mapM :: (a -> Promise b) -> [a] -> Promise [b]`
 *
 * Maps over an array. The returned Promise values will be combined into a
 * single Promise, containing an array of all resolved items.
 */
export const mapM = <A, B> (f: (x: A) => Promise<B>) => async (xs: A[]): Promise<B[]> => {
  const ys: B[] = []

  for (const x of xs) {
    ys.push (await f (x))
  }

  return ys
}

/**
 * `mapMaybe :: (a -> Nullable b) -> [a] -> [NonNullable b]`
 *
 * Maps over an array. If `undefined` is returned, the value is filtered out,
 * otherwise its part of the new array.
 */
export const mapMaybe =
  <A, B> (f: (x: A) => NonNullable<B> | null | undefined) =>
  (xs: A[]): NonNullable<B>[] => {
    const ys: NonNullable<B>[] = []

    for (const x of xs) {
      const y = f (x)

      if (y !== null && y !== undefined) {
        ys.push (y)
      }
    }

    return ys
  }


export type ArrayValue<A> = A extends (infer B)[] ? B : never


export const cons = <A> (x: A) => (xs: A[]): A[] => [ x, ...xs ]
