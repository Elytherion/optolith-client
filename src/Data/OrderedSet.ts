/**
 * @module Data.Set
 *
 * A `Set` is a structure for storing unique values.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe"
import { not } from "./Bool"
import { equals, notEquals } from "./Eq"
import { ident } from "./Function"
import { Internals } from "./Internals"
import { append, List } from "./List"
import { Maybe } from "./Maybe"
import { add, multiply } from "./Num"
import { show } from "./Show"

import isList = Internals.isList
import _OrderedSet = Internals._OrderedSet
import setFromArray = Internals.setFromArray


// CONSTRUCTOR

export interface OrderedSet<A> extends Internals.OrderedSetPrototype<A> {
  readonly value: ReadonlySet<A>
}

/**
 * `fromUniqueElements :: ...a -> Set a`
 *
 * Creates a new `Set` instance from the passed arguments.
 */
export const fromUniqueElements =
  <A> (...xs: A[]): OrderedSet<A> =>
    _OrderedSet (new Set (xs))

/**
 * `fromSet :: NSet a -> Set a`
 *
 * Creates a new `Set` instance from the passed native `Set`.
 */
export const fromSet = <A> (xs: ReadonlySet<A>): OrderedSet<A> => {
  if (xs instanceof Set) {
    return _OrderedSet (xs)
  }

  throw new TypeError (
    `fromArray requires a native Set but instead it received ${show (xs)}`
  )
}


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Set a -> b`
 *
 * Right-associative fold of a structure.
 *
 * In the case of lists, `foldr`, when applied to a binary operator, a
 * starting value (typically the right-identity of the operator), and a list,
 * reduces the list using the binary operator, from right to left:
 *
 * ```foldr f z [x1, x2, ..., xn] == x1 `f` (x2 `f` ... (xn `f` z)...)```
 */
export const foldr =
  <A, B>
  (f: (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: OrderedSet<A>): B =>
    [ ...xs .value ] .reduceRight<B> ((acc, e) => f (e) (acc), initial)

/**
 * `foldl :: (b -> a -> b) -> b -> Set a -> b`
 *
 * Left-associative fold of a structure.
 *
 * In the case of lists, foldl, when applied to a binary operator, a starting
 * value (typically the left-identity of the operator), and a list, reduces
 * the list using the binary operator, from left to right:
 *
 * ```foldl f z [x1, x2, ..., xn] == (...((z `f` x1) `f` x2) `f`...) `f` xn```
 */
export const foldl =
  <A, B>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: OrderedSet<A>): B =>
    [ ...xs .value ] .reduce<B> ((acc, e) => f (acc) (e), initial)

/**
 * `foldr1 :: (a -> a -> a) -> Set a -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A>
  (f: (current: A) => (acc: A) => A) =>
  (xs: OrderedSet<A>): A => {
    if (xs .value .size > 0) {
      const arr = [ ...xs .value ]
      const _init = arr .slice (0, -1)
      const _last = arr [arr .length - 1]

      return _init .reduceRight<A> ((acc, e) => f (e) (acc), _last)
    }

    throw new TypeError ("Cannot apply foldr1 to an empty Set.")
  }

/**
 * `foldl1 :: (a -> a -> a) -> Set a -> a`
 *
 * A variant of `foldl` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldl1 f = foldl1 f . toList`
 */
export const foldl1 =
  <A>
  (f: (acc: A) => (current: A) => A) =>
  (xs: OrderedSet<A>): A => {
    if (xs .value .size > 0) {
      const [ _head, ..._tail ] = xs

      return _tail .reduce<A> ((acc, e) => f (acc) (e), _head)
    }

    throw new TypeError ("Cannot apply foldl1 to an empty Set.")
  }

/**
 * `toList :: Set a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = <A> (xs: OrderedSet<A>): List<A> => List (...xs)

/**
 * `null :: Set a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: OrderedSet<any>): boolean => xs .value .size === 0

/**
 * `length :: Set a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (xs: OrderedSet<any>): number => xs .value .size

/**
 * `elem :: Eq a => a -> Set a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A> (e: A) => (xs: OrderedSet<A>): boolean =>
    [ ...xs .value ] .some (equals (e))

/**
 * `elemF :: Eq a => Set a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF =
  <A> (xs: OrderedSet<A>) => (e: A): boolean => elem (e) (xs)

/**
 * `sum :: Num a => Set a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = foldr (add) (0)

/**
 * `product :: Num a => Set a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = foldr (multiply) (1)

/**
 * `maximum :: Ord a => Set a -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = (xs: OrderedSet<number>): number => Math.max (...xs)

/**
 * `minimum :: Ord a => Set a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = (xs: OrderedSet<number>): number => Math.min (...xs)

// Specialized folds

/**
 * `concat :: Set [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A> (xs: OrderedSet<List<A>>): List<A> =>
    foldl<List<A>, List<A>> (append) (List.empty) (xs)

/**
 * `concatMap :: (a -> Set b) -> Set a -> Set b`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A, B>
  (f: (value: A) => OrderedSet<B>) =>
  (xs: OrderedSet<A>): OrderedSet<B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray (
      [ ...xs .value ] .reduce<B[]> (
        (acc, e) => [ ...acc, ...f (e) ],
        []
      )
    )

/**
 * `and :: Set Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and =
  (xs: OrderedSet<boolean>): boolean =>
    [ ...xs .value ] .every (ident)

/**
 * `or :: Set Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or =
  (xs: OrderedSet<boolean>): boolean =>
    [ ...xs .value ] .some (ident)

/**
 * `any :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A> (f: (x: A) => boolean) => (xs: OrderedSet<A>): boolean =>
    [ ...xs .value ] .some (f)

/**
 * `all :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) => (xs: OrderedSet<A>): boolean =>
    [ ...xs .value ] .every (f)

// Searches

/**
 * `notElem :: Eq a => a -> Set a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (e: A) => pipe (elem<A> (e), not)

interface Find {

  /**
   * `find :: (a -> Bool) -> Set a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (xs: OrderedSet<A>) => Maybe<A1>

  /**
   * `find :: (a -> Bool) -> Set a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (xs: OrderedSet<A>) => Maybe<A>
}

/**
 * `find :: (a -> Bool) -> Set a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (xs: OrderedSet<A>): Maybe<A> =>
    Maybe ([ ...xs .value ] .find (pred))


// CONSTRUCTION

/**
 * `empty :: Set a`
 *
 * The empty `Set`.
 */
export const empty: OrderedSet<any> = _OrderedSet (new Set ())

/**
 * `singleton :: a -> Set a`
 *
 * Create a singleton set.
 */
// eslint-disable-next-line @typescript-eslint/no-use-before-define
export const singleton = <A> (x: A) => fromArray ([ x ])

/**
 * `fromList :: [a] -> Set a`
 *
 * Create a set from a list of elements.
 */
export const fromList = <A> (xs: List<A>): OrderedSet<A> => {
  if (isList (xs)) {
    return _OrderedSet (new Set (List.toArray (xs)))
  }

  throw new TypeError (
    `fromList requires a list but instead it received ${show (xs)}`
  )
}


// INSERTION

/**
 * `insert :: Ord a => a -> Set a -> Set a`
 *
 * Insert an element in a set. If the set already contains an element equal to
 * the given value, it is replaced with the new value.
 */
export const insert =
  <A> (x: A) => (xs: OrderedSet<A>): OrderedSet<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value, x ])

export type insert<A> = (x: A) => (s: OrderedSet<A>) => OrderedSet<A>


// DELETION

/**
 * `delete :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set.
 */
export const sdelete =
  <A> (x: A) => (xs: OrderedSet<A>): OrderedSet<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .filter (notEquals (x)))


// QUERY

/**
 * `member :: Ord a => a -> Set a -> Bool`
 *
 * Is the element in the set?
 */
export const member = elem

/**
 * `notMember :: Ord k => k -> Set a -> Bool`
 *
 * Is the element not in the set?
 */
export const notMember = notElem

/**
 * `size :: Set a -> Int`
 *
 * The number of elements in the set.
 */
export const size = flength


// COMBINE

/**
 * `union :: Ord a => Set a -> Set a -> Set a`
 *
 * The union of two sets, preferring the first set when equal elements are
 * encountered.
 */
export const union =
  <A> (xs1: OrderedSet<A>) => (xs2: OrderedSet<A>): OrderedSet<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs1, ...xs2 ])

/**
 * `difference :: Ord a => Set a -> Set a -> Set a`
 *
 * Difference of two sets.
 *
 * ```haskell
 * difference (Set (1, 2, 3, 4)) (Set (2, 4, 6, 8)) == Set (1, 3)
 * ```
 */
export const difference =
  <A> (xs: OrderedSet<A>) => (excludes: OrderedSet<A>): OrderedSet<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    filter (pipe (elemF (excludes), not)) (xs)

/**
 * `differenceF :: Ord a => Set a -> Set a -> Set a`
 *
 * Difference of two sets.
 *
 * ```haskell
 * difference (Set (1, 2, 3, 4)) (Set (2, 4, 6, 8)) == Set (1, 3)
 * ```
 *
 * Flipped version of `difference`.
 */
export const differenceF =
  <A> (excludes: OrderedSet<A>) => (xs: OrderedSet<A>): OrderedSet<A> =>
    difference (xs) (excludes)


// FILTER

interface Filter {

  /**
   * `filter :: (a -> Bool) -> Set a -> Set a`
   *
   * Filter all values that satisfy the predicate.
   */
  <A, A1 extends A>
  (pred: (x: A) => x is A1):
  (list: OrderedSet<A>) => OrderedSet<A1>

  /**
   * `filter :: (a -> Bool) -> Set a -> Set a`
   *
   * Filter all values that satisfy the predicate.
   */
  <A>
  (pred: (x: A) => boolean):
  (list: OrderedSet<A>) => OrderedSet<A>
}

/**
 * `filter :: (a -> Bool) -> Set a -> Set a`
 *
 * Filter all values that satisfy the predicate.
 */
export const filter: Filter =
  <A> (pred: (x: A) => boolean) => (xs: OrderedSet<A>): OrderedSet<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .filter (pred))


// MAP

/**
 * `map :: Ord b => (a -> b) -> Set a -> Set b`
 *
 * `map f s` is the set obtained by applying `f` to each element of `s`.
 *
 * It's worth noting that the size of the result may be smaller if, for some
 * `(x,y), x /= y && f x == f y`.
 */
export const map =
  <A, B> (f: (value: A) => B) => (xs: OrderedSet<A>): OrderedSet<B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .map (f))


// CONVERSION LIST

/**
 * `elems :: Set a -> [a]`
 *
 * An alias of toAscList. The elements of a set in ascending order. Subject to
 * list fusion.
 */
export const elems = toList


// CUSTOM FUNCTIONS

/**
 * Converts the `OrderedSet` into a native Set instance.
 */
export const toSet = <A> (xs: OrderedSet<A>): ReadonlySet<A> => xs .value

/**
 * Converts the `OrderedSet` into a native array instance.
 */
export const toArray = <A> (xs: OrderedSet<A>): A[] => [ ...xs ]

/**
 * `toggle :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set if the value already exists in the set.
 * Otherwise, insert the element in the set.
 */
export const toggle =
  <A> (x: A) => (xs: OrderedSet<A>): OrderedSet<A> =>
    member (x) (xs) ? sdelete (x) (xs) : insert (x) (xs)

export import isOrderedSet = Internals.isOrderedSet

/**
 * `fromArray :: Array a -> Set a`
 *
 * Creates a new `Set` instance from the passed native `Array`.
 */
export const fromArray = setFromArray (show)


// NAMESPACED FUNCTIONS

export const OrderedSet = {
  fromUniqueElements,
  fromArray,
  fromSet,

  foldr,
  foldl,
  foldr1,
  foldl1,
  toList,
  fnull,
  flength,
  elem,
  elemF,
  sum,
  product,
  maximum,
  minimum,
  concat,
  concatMap,
  and,
  or,
  any,
  all,
  notElem,
  find,

  empty,
  singleton,
  fromList,

  insert,

  sdelete,

  member,
  notMember,
  size,

  union,
  difference,
  differenceF,

  filter,

  map,

  elems,

  toSet,
  toArray,
  toggle,
  isOrderedSet,
}
