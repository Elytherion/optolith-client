import { fmap } from "../../../../../Data/Functor"
import { map } from "../../../../../Data/List"
import { Nothing } from "../../../../../Data/Maybe"
import { IdPrefixes } from "../../../../Constants/IdPrefixes"
import { CombatTechnique } from "../../../../Models/Wiki/CombatTechnique"
import { prefixId } from "../../../IDUtils"
import { mergeRowsById } from "../MergeRows"
import { modifyNegIntNoBreak } from "../SourceHelpers"
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic"
import { mensureMapNatural, mensureMapNaturalList, mensureMapNonEmptyString } from "../Validators/ToValue"
import { toErrata } from "./Sub/toErrata"
import { toSourceLinks } from "./Sub/toSourceLinks"

export const toCombatTechnique =
  mergeRowsById
    ("toCombatTechnique")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalList ("&")) (TableType.Univ) (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural) (TableType.Univ) (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const eic = checkUnivNaturalNumber ("ic")

      const eprimary = checkUnivNaturalNumberList ("primary")

      const ebpr = checkUnivNaturalNumber ("bpr")

      const special = lookup_l10n ("special")

      const egr = checkUnivNaturalNumber ("gr")

      const esrc = toSourceLinks (lookup_l10n)

      const eerrata = toErrata (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          eic,
          eprimary,
          ebpr,
          egr,
          esrc,
          eerrata,
        })
        (rs => CombatTechnique ({
          id: prefixId (IdPrefixes.COMBAT_TECHNIQUES) (id),
          name: rs.ename,
          ic: rs.eic,
          primary: map (prefixId (IdPrefixes.ATTRIBUTES)) (rs.eprimary),
          bpr: rs.ebpr,
          special: fmap (modifyNegIntNoBreak) (special),
          src: rs.esrc,
          errata: rs.eerrata,
          gr: rs.egr,
          category: Nothing,
        }))
    })
