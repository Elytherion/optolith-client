import { fromDefault, Record } from "../../structures/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface CursesSelection {
  id: ProfessionSelectionIds
  value: number
}

export const CursesSelection =
  fromDefault<CursesSelection> ({
    id: ProfessionSelectionIds.CURSES,
    value: 0,
  })

export const isCursesSelection =
  (obj: AnyProfessionSelection): obj is Record<CursesSelection> =>
    CursesSelection.A.id (obj) === ProfessionSelectionIds.CURSES
