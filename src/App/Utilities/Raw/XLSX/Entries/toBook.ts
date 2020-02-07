import { Book } from "../../../../Models/Wiki/Book"
import { fromRow } from "../MergeRows"
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic"
import { mensureMapBoolean, mensureMapNonEmptyString } from "../Validators/ToValue"

export const toBook =
  fromRow
    ("toBook")
    (id => lookup_l10n => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkL10nBoolean =
        lookupKeyValid (mensureMapBoolean) (TableType.L10n) (lookup_l10n)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const eshort = checkL10nNonEmptyString ("short")

      const eisCore = checkL10nBoolean ("isCore")

      const eisAdultContent = checkL10nBoolean ("isAdultContent")

      // Return error or result

      return mapMNamed
        ({
          ename,
          eshort,
          eisCore,
          eisAdultContent,
        })
        (rs => Book ({
          id,
          name: rs.ename,
          short: rs.eshort,
          isCore: rs.eisCore,
          isAdultContent: rs.eisAdultContent,
        }))
    })
