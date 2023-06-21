import { FocusRule, FocusRuleTranslation } from "optolith-database-schema/types/rule/FocusRule"
import { FC, useMemo } from "react"
import { compareAt } from "../../../../../shared/utils/sort.ts"
import { useIsEntryAvailable } from "../../../../hooks/isAvailable.ts"
import { useLocaleCompare } from "../../../../hooks/localeCompare.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { useTranslate } from "../../../../hooks/translate.ts"
import { useTranslateMap } from "../../../../hooks/translateMap.ts"
import { selectActiveFocusRules } from "../../../../slices/characterSlice.ts"
import { selectFocusRules } from "../../../../slices/databaseSlice.ts"
import { FocusRulesItem } from "./FocusRulesItem.tsx"

export const FocusRules: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()
  const isEntryAvailable = useIsEntryAvailable()

  const focusRules = useAppSelector(selectFocusRules)
  const activeFocusRules = useAppSelector(selectActiveFocusRules)
  const focusRuleOptions = useMemo(
    () =>
      Object.values(focusRules)
        .filter(x => isEntryAvailable(x.src) || Object.hasOwn(activeFocusRules, x.id))
        .map(x => ({ focusRule: x, focusRuleTranslation: translateMap(x.translations) }))
        .filter((x): x is {
          focusRule: FocusRule
          focusRuleTranslation: FocusRuleTranslation
        } => x.focusRuleTranslation !== undefined)
        .sort(compareAt(x => translateMap(x.focusRule.translations)?.name ?? "", localeCompare)),
    [ activeFocusRules, focusRules, isEntryAvailable, localeCompare, translateMap ],
  )

  return (
    <>
      <h2>{translate("Focus Rules")}</h2>
      <ul className="focus-rules">
        {focusRuleOptions.map(focusRule => (
          <FocusRulesItem key={focusRule.focusRule.id} focusRule={focusRule} />
        ))}
      </ul>
    </>
  )
}
