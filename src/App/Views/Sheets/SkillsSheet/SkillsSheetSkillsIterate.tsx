import * as React from "react"
import { equals } from "../../../../Data/Eq"
import { fmap } from "../../../../Data/Functor"
import { find, intercalate, List, map, toArray } from "../../../../Data/List"
import { mapMaybe, maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { fst, Pair, snd } from "../../../../Data/Tuple"
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined"
import { SkillCombined, SkillCombinedA_ } from "../../../Models/View/SkillCombined"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils"
import { ndash } from "../../../Utilities/Chars"
import { compareLocale, translate } from "../../../Utilities/I18n"
import { getRoutineValue } from "../../../Utilities/Increasable/skillUtils"
import { sign } from "../../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { comparingR, sortByMulti } from "../../../Utilities/sortBy"

export const iterateList =
  (l10n: L10nRecord) =>
  (checkValueVisibility: boolean) =>
  (attributes: List<Record<AttributeCombined>>) =>
  (skills: List<Record<SkillCombined>>): JSX.Element[] =>
    pipe_ (
      skills,
      sortByMulti ([ comparingR (SkillCombinedA_.name) (compareLocale (l10n)) ]),
      map (obj => {
        const check_vals = mapMaybe (pipe (
                                      (id: string) => find (pipe (
                                                             AttributeCombinedA_.id,
                                                             equals (id)
                                                           ))
                                                           (attributes),
                                      fmap (AttributeCombinedA_.value)
                                    ))
                                    (SkillCombinedA_.check (obj))

        const check_str =
          pipe_ (
            obj,
            SkillCombinedA_.check,
            mapMaybe (pipe (
              id => find (pipe (AttributeCombinedA_.id, equals (id)))
                         (attributes),
              fmap (attr => checkValueVisibility
                              ? AttributeCombinedA_.value (attr)
                              : AttributeCombinedA_.short (attr))
            )),
            intercalate ("/")
          )

        const enc = SkillCombinedA_.encumbrance (obj)

        const enc_str = enc === "true"
          ? translate (l10n) ("yes")
          : enc === "false"
          ? translate (l10n) ("no")
          : translate (l10n) ("maybe")

        const mroutine = getRoutineValue (check_vals) (SkillCombinedA_.value (obj))

        return (
          <tr key={SkillCombinedA_.id (obj)}>
            <td className="name">{SkillCombinedA_.name (obj)}</td>
            <td className="check">{check_str}</td>
            <td className="enc">{enc_str}</td>
            <td className="ic">{getICName (SkillCombinedA_.ic (obj))}</td>
            <td className="sr">{SkillCombinedA_.value (obj)}</td>
            <td className="routine">
              {maybe (ndash)
                     ((routine: Pair<number, boolean>) =>
                       `${sign (fst (routine))}${snd (routine) ? "!" : ""}`)
                     (mroutine)}
            </td>
            <td className="comment" />
          </tr>
        )
      }),
      toArray
    )
