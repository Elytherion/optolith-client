import { OptionalRule, OptionalRuleTranslation } from "optolith-database-schema/types/rule/OptionalRule"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { OptionalRuleIdentifier } from "../../../../../shared/domain/identifier.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectActiveOptionalRules } from "../../../../slices/characterSlice.ts"
import { changeInlineLibraryEntry } from "../../../../slices/inlineWikiSlice.ts"
import { changeOptionalRuleOption, switchOptionalRule } from "../../../../slices/rulesSlice.ts"

type Props = {
  optionalRule: {
    optionalRule: OptionalRule
    optionalRuleTranslation: OptionalRuleTranslation
  }
}

export const OptionalRulesItem: FC<Props> = props => {
  const { optionalRule: { optionalRule, optionalRuleTranslation } } = props

  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const activeOptionalRules = useAppSelector(selectActiveOptionalRules)

  const handleSwitch = useCallback(
    () => dispatch(switchOptionalRule(optionalRule.id)),
    [ dispatch, optionalRule.id ],
  )

  const handleChangeInlineLibraryEntry = useCallback(
    () => dispatch(changeInlineLibraryEntry({
      tag: "OptionalRule",
      optional_rule: optionalRule.id,
    })),
    [ dispatch, optionalRule.id ],
  )

  const handleChangeOption = useCallback(
    (option: number) => dispatch(changeOptionalRuleOption({
      id: optionalRule.id,
      option,
    })),
    [ dispatch, optionalRule.id ],
  )

  const isActive = Object.hasOwn(activeOptionalRules, optionalRule.id)

  return (
    <li>
      <Checkbox
        checked={isActive}
        onClick={handleSwitch}
        label={optionalRuleTranslation.name}
        disabled={optionalRule.is_missing_implementation}
        />
      {optionalRule.id === OptionalRuleIdentifier.HigherDefenseStats
        ? (
        <Dropdown
          options={[
            { id: 2, name: "+2" },
            { id: 4, name: "+4" },
          ]}
          value={activeOptionalRules[optionalRule.id]?.options?.[0] ?? 2}
          onChange={handleChangeOption}
          disabled={!isActive}
          />
        )
        : null}
      <IconButton
        icon="&#xE912;"
        label={translate("Show details")}
        onClick={handleChangeInlineLibraryEntry}
        flat
        />
    </li>
  )
}
