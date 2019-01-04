import { fromDefault, Record } from "../../structures/Record";
import { AnyProfessionVariantSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";
import { SpecializationSelection } from "./SpecializationSelection";

export interface RemoveSpecializationSelection {
  id: ProfessionSelectionIds
  active: false
}

export type VariantSpecializationSelection =
  Record<SpecializationSelection> |
  Record<RemoveSpecializationSelection>

const _RemoveSpecializationSelection =
  fromDefault<RemoveSpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    active: false,
  })

export const RemoveSpecializationSelection =
  _RemoveSpecializationSelection ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    active: false,
  })

export const isRemoveSpecializationSelection =
  (obj: AnyProfessionVariantSelection): obj is Record<RemoveSpecializationSelection> =>
    obj === RemoveSpecializationSelection
