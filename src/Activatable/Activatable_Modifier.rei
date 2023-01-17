/**
 * `modifyByLevel value inc dec` modifies a base `value` by the active level of
 * the passed entries. The `inc` entry's level increases the value while the
 * `dec` entry's level decreases the value.
 */
let modifyByLevel:
  (
    int,
    option(Activatable_Dynamic.t('a)),
    option(Activatable_Dynamic.t('a))
  ) =>
  int;

/**
 * `modifyByLevelM value inc dec` modifies a base `value` by the active level of
 * the passed entries. The `inc` entry's level increases the value while the
 * `dec` entry's level decreases the value. If `value` is `Nothing`, this
 * function always returns `0`.
 */
let modifyByLevelM:
  (
    option(int),
    option(Activatable_Dynamic.t('a)),
    option(Activatable_Dynamic.t('a))
  ) =>
  int;

/**
 * `getModifierByActiveLevel value inc dec` adjusts the given base `value`. If
 * the entry `inc`, that should increase the base, is active, it adds `1` to the
 * base. If the entry `dec`, that should decrease the base, is active, it
 * subtracts `1` from the base. If the passed base is `Nothing`, this function
 * always returns `0`.
 */
let getModifierByIsActive:
  (
    option(int),
    option(Activatable_Dynamic.t('a)),
    option(Activatable_Dynamic.t('a))
  ) =>
  int;

/**
 * `getModifierByActiveLevels value incs decs` adjusts the given base `value` by
 * summing all active entries that should increase the base (`incs`) and all
 * active entries that should decrease the base (`decs`).
 */
let getModifierByIsActives:
  (
    option(int),
    list(option(Activatable_Dynamic.t('a))),
    list(option(Activatable_Dynamic.t('a)))
  ) =>
  int;
