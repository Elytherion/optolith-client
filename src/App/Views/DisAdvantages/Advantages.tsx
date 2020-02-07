import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { Advantage } from "../../Models/Wiki/Advantage"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { AdvantagesDisadvantages } from "./AdvantagesDisadvantages"

export interface AdvantagesOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
}

export interface AdvantagesStateProps {
  activeList: Maybe<List<Record<ActiveActivatable<Advantage>>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  deactiveList: Maybe<List<
    Record<ActiveActivatable<Advantage>>
    | Record<InactiveActivatable<Advantage>>
  >>
  enableActiveItemHints: boolean
  magicalMax: Maybe<number>
  rating: Maybe<OrderedMap<string, EntryRating>>
  showRating: boolean
  isRemovingEnabled: boolean
  filterText: string
  inactiveFilterText: string
}

export interface AdvantagesDispatchProps {
  switchActiveItemHints (): void
  switchRatingVisibility (): void
  addToList (args: Record<ActivatableActivationOptions>): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  setLevel (id: string, index: number, level: number): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

export type AdvantagesProps = AdvantagesStateProps & AdvantagesDispatchProps & AdvantagesOwnProps

export const Advantages: React.FC<AdvantagesProps> = props => {
  const {
    l10n,
    activeList,
    ap,
    deactiveList,
    enableActiveItemHints,
    magicalMax,
    rating,
    showRating,
    isRemovingEnabled,
    filterText,
    inactiveFilterText,
    switchActiveItemHints,
    switchRatingVisibility,
    addToList,
    removeFromList,
    setLevel,
    setFilterText,
    setInactiveFilterText,
  } = props

  return (
    <AdvantagesDisadvantages
      l10n={l10n}
      activeList={activeList}
      ap={ap}
      deactiveList={deactiveList}
      enableActiveItemHints={enableActiveItemHints}
      magicalMax={magicalMax}
      rating={rating}
      showRating={showRating}
      isRemovingEnabled={isRemovingEnabled}
      filterText={filterText}
      inactiveFilterText={inactiveFilterText}
      isAdvantages
      switchActiveItemHints={switchActiveItemHints}
      switchRatingVisibility={switchRatingVisibility}
      addToList={addToList}
      removeFromList={removeFromList}
      setLevel={setLevel}
      setFilterText={setFilterText}
      setInactiveFilterText={setInactiveFilterText}
      />
  )
}
