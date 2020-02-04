import * as React from "react"
import { equals } from "../../../Data/Eq"
import { find, List } from "../../../Data/List"
import { bind, fromJust, isJust, Maybe, maybe_, Nothing } from "../../../Data/Maybe"
import { lookup, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { IdPrefixes } from "../../Constants/IdPrefixes"
import { Sex } from "../../Models/Hero/heroTypeHelpers"
import { Item } from "../../Models/Hero/Item"
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined"
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined"
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Blessing } from "../../Models/Wiki/Blessing"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { Disadvantage } from "../../Models/Wiki/Disadvantage"
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../Models/Wiki/Skill"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { Spell } from "../../Models/Wiki/Spell"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { InlineWikiEntry } from "../../Models/Wiki/wikiTypeHelpers"
import { getCategoryById, getIdPrefix } from "../../Utilities/IDUtils"
import { pipe } from "../../Utilities/pipe"
import { WikiActivatableInfo } from "./WikiActivatableInfo"
import { WikiBlessingInfo } from "./WikiBlessingInfo"
import { WikiCantripInfo } from "./WikiCantripInfo"
import { WikiCombatTechniqueInfo } from "./WikiCombatTechniqueInfo"
import { WikiCultureInfo } from "./WikiCultureInfo"
import { WikiEquipmentInfo } from "./WikiEquipmentInfo"
import { WikiInfoContentWrapper } from "./WikiInfoContentWrapper"
import { WikiLiturgicalChantInfo } from "./WikiLiturgicalChantInfo"
import { WikiProfessionInfo } from "./WikiProfessionInfo"
import { WikiRaceInfo } from "./WikiRaceInfo"
import { WikiSkillInfo } from "./WikiSkillInfo"
import { WikiSpellInfo } from "./WikiSpellInfo"

const WA = WikiModel.A

const getEntry =
  (props: WikiInfoContentStateProps) =>
  (mid: Maybe<string>) =>
    bind (mid)
         (id => {
           const mcategory = getCategoryById (id)

           return maybe_ ((): Maybe<InlineWikiEntry> => {
                           const prefix = getIdPrefix (id)

                           if (prefix === IdPrefixes.ITEM) {
                             return bind (props.items) (lookup (id))
                           }
                           else if (prefix === IdPrefixes.ITEM_TEMPLATE) {
                             return lookup (id) (WA.itemTemplates (props.wiki))
                           }
                           else {
                             return Nothing
                           }
                         })
                         ((category: Category) => {
                           switch (category) {
                             case Category.ADVANTAGES:
                               return lookup (id) (WA.advantages (props.wiki))

                             case Category.BLESSINGS:
                               return lookup (id) (WA.blessings (props.wiki))

                             case Category.CANTRIPS:
                               return lookup (id) (WA.cantrips (props.wiki))

                             case Category.COMBAT_TECHNIQUES:
                               return lookup (id) (WA.combatTechniques (props.wiki))

                             case Category.CULTURES:
                               return find (pipe (CultureCombinedA_.id, equals (id)))
                                           (props.combinedCultures)

                             case Category.DISADVANTAGES:
                               return lookup (id) (WA.disadvantages (props.wiki))

                             case Category.LITURGICAL_CHANTS:
                               return lookup (id) (WA.liturgicalChants (props.wiki))

                             case Category.PROFESSIONS:
                               return find (pipe (ProfessionCombinedA_.id, equals (id)))
                                           (props.combinedProfessions)

                             case Category.RACES:
                               return find (pipe (RaceCombinedA_.id, equals (id)))
                                           (props.combinedRaces)

                             case Category.SPECIAL_ABILITIES:
                               return lookup (id) (WA.specialAbilities (props.wiki))

                             case Category.SPELLS:
                               return lookup (id) (WA.spells (props.wiki))

                             case Category.SKILLS:
                               return lookup (id) (WA.skills (props.wiki))

                             default:
                               return Nothing
                           }
                         })
                         (mcategory)
         })

export interface WikiInfoContentOwnProps {
  currentId: Maybe<string>
  l10n: L10nRecord
  noWrapper?: boolean
}

export interface WikiInfoContentStateProps {
  combinedRaces: List<Record<RaceCombined>>
  combinedCultures: List<Record<CultureCombined>>
  combinedProfessions: List<Record<ProfessionCombined>>
  items: Maybe<OrderedMap<string, Record<Item>>>
  languages: Maybe<Record<SpecialAbility>>
  liturgicalChantExtensions: Maybe<Record<SpecialAbility>>
  scripts: Maybe<Record<SpecialAbility>>
  sex: Maybe<Sex>
  spellExtensions: Maybe<Record<SpecialAbility>>
  wiki: WikiModelRecord
}

export interface WikiInfoContentDispatchProps { }

export type WikiInfoContentProps =
  WikiInfoContentStateProps
  & WikiInfoContentDispatchProps
  & WikiInfoContentOwnProps

export const WikiInfoContent: React.FC<WikiInfoContentProps> = props => {
  const {
    l10n,
    currentId: mid,
    noWrapper,
    languages,
    liturgicalChantExtensions,
    scripts,
    sex,
    spellExtensions,
    wiki,
  } = props

  const mx = getEntry (props) (mid)

  if (isJust (mx)) {
    const x = fromJust (mx)

    if (Item.is (x) || ItemTemplate.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiEquipmentInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (Advantage.is (x) || Disadvantage.is (x) || SpecialAbility.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiActivatableInfo
            l10n={l10n}
            wiki={wiki}
            x={x}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (Blessing.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiBlessingInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (Cantrip.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiCantripInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (CombatTechnique.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiCombatTechniqueInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            sex={sex}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (CultureCombined.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiCultureInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            languages={languages}
            scripts={scripts}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (LiturgicalChant.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiLiturgicalChantInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            liturgicalChantExtensions={liturgicalChantExtensions}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (ProfessionCombined.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiProfessionInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            sex={sex}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (RaceCombined.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiRaceInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (Spell.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiSpellInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            spellExtensions={spellExtensions}
            />
        </WikiInfoContentWrapper>
      )
    }

    if (Skill.is (x)) {
      return (
        <WikiInfoContentWrapper noWrapper={noWrapper}>
          <WikiSkillInfo
            wiki={wiki}
            l10n={l10n}
            x={x}
            />
        </WikiInfoContentWrapper>
      )
    }
  }

  return <WikiInfoContentWrapper noWrapper={noWrapper} />
}
