/**
 * @module Data.Ix
 *
 * The `Ix` class is used to map a contiguous subrange of values in type onto
 * integers.
 *
 * @author Lukas Obermann
 */

import { cons, List } from "./List"
import { inc } from "./Num"
import { show } from "./Show"
import { fst, Pair, snd } from "./Tuple"


// MODULE HELPER FUNCTIONS

const buildRangeList =
  (u: number) => (x: number) => (xs: List<number>): List<number> =>
    x > u ? xs : cons (buildRangeList (u) (inc (x)) (xs)) (x)


/**
 * `range :: Int a => (a, a) -> [a]`
 *
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const range =
  (b: Pair<number, number>): List<number> =>
    buildRangeList (snd (b)) (fst (b)) (List.empty)


/**
 * `rangeN :: Int a => (a, a) -> [a]`
 *
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 *
 * Native version of `range`.
 */
export const rangeN =
  (l: number, u: number): List<number> =>
    buildRangeList (u) (l) (List.empty)


/**
 * `inRange :: Int a => (a, a) -> a -> Bool`
 *
 * Returns `True` the given subscript lies in the range defined the bounding
 * pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const inRange =
  (b: Pair<number, number>) => (x: number): boolean =>
    x >= fst (b) && x <= snd (b)


/**
 * `index :: Int a => (a, a) -> a -> Int`
 *
 * The position of a subscript in the subrange.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const index =
  (b: Pair<number, number>) => (x: number): number => {
    if (inRange (b) (x)) {
      return x - fst (b)
    }

    throw new RangeError (
      `Ix.index: Index (${show (x)}) out of range (${show (b)}`
    )
  }


/**
 * `inRangeN :: Int a => (a, a) -> a -> Bool`
 *
 * Returns `True` the given subscript lies in the range defined the bounding
 * pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 *
 * Native version of `inRange`.
 */
export const inRangeN =
  (l: number, u: number) => (x: number): boolean =>
    x >= l && x <= u


/**
 * `rangeSize :: Int a => (a, a) -> Int`
 *
 * The size of the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const rangeSize =
  (b: Pair<number, number>): number =>
    fst (b) <= snd (b) ? snd (b) - fst (b) + 1 : 0


// NAMESPACED FUNCTIONS

export const Ix = {
  range,
  index,
  inRange,
  rangeSize,
}
