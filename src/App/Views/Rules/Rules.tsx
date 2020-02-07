import * as React from "react"
import { List } from "../../../Data/List"
import { fromMaybe, isJust, Just, liftM2, Maybe, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { Rules } from "../../Models/Hero/Rules"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { Book } from "../../Models/Wiki/Book"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { Locale } from "../../Utilities/Raw/JSON/Config"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"
import { Scroll } from "../Universal/Scroll"
import { BookSelection } from "./BookSelection"

export interface RulesOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface RulesStateProps {
  sortedBooks: List<Record<Book>>
  isEnableLanguageSpecializationsDeactivatable: boolean
  hero_locale: Locale
  mcurrent_guild_mage_spell: Maybe<Maybe<string>>
  all_spells_select_options: Maybe<List<Record<DropdownOption>>>
}

export interface RulesDispatchProps {
  changeAttributeValueLimit (): void
  changeHigherParadeValues (id: Maybe<number>): void
  switchEnableAllRuleBooks (): void
  switchEnableRuleBook (id: string): void
  switchEnableLanguageSpecializations (): void
  setHeroLocale (locale: Locale): void
  setGuildMageSpell (spellId: string): void
}

type Props = RulesStateProps & RulesDispatchProps & RulesOwnProps

export const RulesView: React.FC<Props> = props => {
  const {
    sortedBooks,
    changeAttributeValueLimit,
    changeHigherParadeValues,
    l10n,
    switchEnableAllRuleBooks,
    switchEnableRuleBook,
    isEnableLanguageSpecializationsDeactivatable,
    switchEnableLanguageSpecializations,
    hero,
    all_spells_select_options,
    hero_locale,
    mcurrent_guild_mage_spell,
    setGuildMageSpell,
    setHeroLocale,
  } = props

  const rules = HeroModel.A.rules (hero)
  const allRuleBooksEnabled = Rules.A.enableAllRuleBooks (rules)
  const enabledRuleBooks = Rules.A.enabledRuleBooks (rules)

  const higherParadeValues = Rules.A.higherParadeValues (rules)

  const areHigherParadeValuesEnabled = higherParadeValues > 0

  const attributeValueLimit = Rules.A.attributeValueLimit (rules)

  const enableLanguageSpecializations = Rules.A.enableLanguageSpecializations (rules)

  const handleHigherParadeValues =
    React.useCallback (
      () => changeHigherParadeValues (Just (areHigherParadeValuesEnabled ? 0 : 2)),
      [ changeHigherParadeValues, areHigherParadeValuesEnabled ]
    )

  return (
    <div className="page" id="optional-rules">
      <Scroll>
        <h3>{translate (l10n) ("rulebase")}</h3>
        <BookSelection
          allRuleBooksEnabled={allRuleBooksEnabled}
          enabledRuleBooks={enabledRuleBooks}
          l10n={l10n}
          sortedBooks={sortedBooks}
          switchEnableAllRuleBooks={switchEnableAllRuleBooks}
          switchEnableRuleBook={switchEnableRuleBook}
          />
        <h3>{translate (l10n) ("optionalrules")}</h3>
        <div className="extended">
          <Checkbox
            checked={areHigherParadeValuesEnabled}
            onClick={handleHigherParadeValues}
            label={translate (l10n) ("higherdefensestats")}
            />
          <Dropdown
            options={List (
              DropdownOption ({ id: Just (2), name: "+2" }),
              DropdownOption ({ id: Just (4), name: "+4" })
            )}
            value={higherParadeValues}
            onChange={changeHigherParadeValues}
            disabled={higherParadeValues === 0}
            />
        </div>
        <Checkbox
          checked={attributeValueLimit}
          onClick={changeAttributeValueLimit}
          label={translate (l10n) ("maximumattributescores")}
          />
        <Checkbox
          checked={enableLanguageSpecializations}
          onClick={switchEnableLanguageSpecializations}
          label={translate (l10n) ("languagespecializations")}
          disabled={isEnableLanguageSpecializationsDeactivatable}
          />
        <div className="temporary-fixes">
          <h3>{translate (l10n) ("manualherodatarepair")}</h3>
          <p>{translate (l10n) ("manualherodatarepairexplanation")}</p>
          <Dropdown
            options={List (
              DropdownOption ({
                id: Just (Locale.German),
                name: "Deutsch (Deutschland)",
              }),
              DropdownOption ({
                id: Just (Locale.English),
                name: "English (United States)",
              }),
              DropdownOption ({
                id: Just (Locale.Dutch),
                name: "Nederlands (België)",
              }),
              DropdownOption ({
                id: Just (Locale.French),
                name: "Français (France)",
              })
            )}
            value={hero_locale}
            label={translate (l10n) ("language")}
            onChangeJust={setHeroLocale}
            />
          {fromMaybe (
                       <Dropdown
                         options={List ()}
                         value={Nothing}
                         label="Tradition (Guild Mage) Unfamiliar Spell"
                         hint="No 'Tradition (Guild Mage)' present"
                         onChangeJust={setGuildMageSpell}
                         disabled
                         />
                     )
                     (liftM2 ((mcurr_spell_id: Maybe<string>) =>
                              (spells: List<Record<DropdownOption>>) => (
                                <Dropdown
                                  options={spells}
                                  value={mcurr_spell_id}
                                  label="Tradition (Guild Mage) Unfamiliar Spell"
                                  onChangeJust={setGuildMageSpell}
                                  disabled={isJust (mcurr_spell_id)}
                                  />
                              ))
                             (mcurrent_guild_mage_spell)
                             (all_spells_select_options))}
        </div>
      </Scroll>
    </div>
  )
}
