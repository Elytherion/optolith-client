import { MagicalTradition } from "optolith-database-schema/types/specialAbility/MagicalTradition"
import { mapNullableDefault } from "../../utils/nullable.ts"
import { Activatable, isActive } from "./activatableEntry.ts"

/**
 * A combination of a static and corresponding dynamic active magical tradition
 * entry.
 */
export type CombinedActiveMagicalTradition = {
  static: MagicalTradition
  dynamic: Activatable
}

/**
 * A capability type for getting the active magical traditions.
 */
export type GetActiveMagicalTraditionsCapability = () => CombinedActiveMagicalTradition[]

/**
 * Checks if a character is a spellcaster.
 */
export const isSpellcaster = (
  spellcaster: Activatable | undefined,
  magicalTraditions: Activatable[],
): boolean => isActive(spellcaster) && magicalTraditions.some(isActive)

/**
 * Returns the maximum number of adventure points that can be spent for magical
 * advantages and disadvantages.
 */
export const getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages = (
  activeMagicalTraditions: MagicalTradition[],
): number =>
  activeMagicalTraditions.reduce(
    (currentMax, tradition) =>
      mapNullableDefault(
        tradition.alternative_magical_adventure_points_maximum,
        altMax => Math.min(altMax, currentMax),
        currentMax,
      ),
    50,
  )
