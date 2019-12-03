import * as React from "react";
import { equals } from "../../../Data/Eq";
import { find, List } from "../../../Data/List";
import { bind, fromJust, isJust, Maybe, maybe_, Nothing } from "../../../Data/Maybe";
import { lookup, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Category } from "../../Constants/Categories";
import { IdPrefixes } from "../../Constants/IdPrefixes";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { Item } from "../../Models/Hero/Item";
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined";
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined";
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Book } from "../../Models/Wiki/Book";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { Culture } from "../../Models/Wiki/Culture";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant";
import { Race } from "../../Models/Wiki/Race";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { InlineWikiEntry } from "../../Models/Wiki/wikiTypeHelpers";
import { getCategoryById, getIdPrefix } from "../../Utilities/IDUtils";
import { pipe } from "../../Utilities/pipe";
import { WikiActivatableInfo } from "./WikiActivatableInfo";
import { WikiBlessingInfo } from "./WikiBlessingInfo";
import { WikiCantripInfo } from "./WikiCantripInfo";
import { WikiCombatTechniqueInfo } from "./WikiCombatTechniqueInfo";
import { WikiCultureInfo } from "./WikiCultureInfo";
import { WikiEquipmentInfo } from "./WikiEquipmentInfo";
import { WikiInfoContentWrapper } from "./WikiInfoContentWrapper";
import { WikiLiturgicalChantInfo } from "./WikiLiturgicalChantInfo";
import { WikiProfessionInfo } from "./WikiProfessionInfo";
import { WikiRaceInfo } from "./WikiRaceInfo";
import { WikiSkillInfo } from "./WikiSkillInfo";
import { WikiSpellInfo } from "./WikiSpellInfo";

export interface WikiInfoContentOwnProps {
  currentId: Maybe<string>
  l10n: L10nRecord
  noWrapper?: boolean
}

export interface WikiInfoContentStateProps {
  attributes: OrderedMap<string, Record<Attribute>>
  advantages: OrderedMap<string, Record<Advantage>>
  books: OrderedMap<string, Record<Book>>
  blessings: OrderedMap<string, Record<Blessing>>
  cantrips: OrderedMap<string, Record<Cantrip>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  cultures: OrderedMap<string, Record<Culture>>
  combinedRaces: List<Record<RaceCombined>>
  combinedCultures: List<Record<CultureCombined>>
  combinedProfessions: List<Record<ProfessionCombined>>
  disadvantages: OrderedMap<string, Record<Disadvantage>>
  items: Maybe<OrderedMap<string, Record<Item>>>
  itemTemplates: OrderedMap<string, Record<ItemTemplate>>
  languages: Maybe<Record<SpecialAbility>>
  liturgicalChantExtensions: Maybe<Record<SpecialAbility>>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  professionVariants: OrderedMap<string, Record<ProfessionVariant>>
  races: OrderedMap<string, Record<Race>>
  scripts: Maybe<Record<SpecialAbility>>
  sex: Maybe<Sex>
  skills: OrderedMap<string, Record<Skill>>
  spellExtensions: Maybe<Record<SpecialAbility>>
  spells: OrderedMap<string, Record<Spell>>
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
  wiki: WikiModelRecord
}

export interface WikiInfoContentDispatchProps { }

export type WikiInfoContentProps =
  WikiInfoContentStateProps
  & WikiInfoContentDispatchProps
  & WikiInfoContentOwnProps

export function WikiInfoContent (props: WikiInfoContentProps) {
  const { currentId: mid } = props

  const mx = getEntry (props) (mid)

  if (isJust (mx)) {
    const x = fromJust (mx)

    if (Item.is (x) || ItemTemplate.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiEquipmentInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Advantage.is (x) || Disadvantage.is (x) || SpecialAbility.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiActivatableInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Blessing.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiBlessingInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Cantrip.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiCantripInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (CombatTechnique.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiCombatTechniqueInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (CultureCombined.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiCultureInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (LiturgicalChant.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiLiturgicalChantInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (ProfessionCombined.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiProfessionInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (RaceCombined.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiRaceInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Spell.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiSpellInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Skill.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiSkillInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }
  }

  return <WikiInfoContentWrapper {...props} />
}

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
                             return lookup (id) (props.itemTemplates)
                           }
                           else {
                             return Nothing
                           }
                         })
                         ((category: Category) => {
                           switch (category) {
                             case Category.ADVANTAGES:
                               return lookup (id) (props.advantages)

                             case Category.BLESSINGS:
                               return lookup (id) (props.blessings)

                             case Category.CANTRIPS:
                               return lookup (id) (props.cantrips)

                             case Category.COMBAT_TECHNIQUES:
                               return lookup (id) (props.combatTechniques)

                             case Category.CULTURES:
                               return find (pipe (CultureCombinedA_.id, equals (id)))
                                           (props.combinedCultures)

                             case Category.DISADVANTAGES:
                               return lookup (id) (props.disadvantages)

                             case Category.LITURGICAL_CHANTS:
                               return lookup (id) (props.liturgicalChants)

                             case Category.PROFESSIONS:
                               return find (pipe (ProfessionCombinedA_.id, equals (id)))
                                           (props.combinedProfessions)

                             case Category.RACES:
                               return find (pipe (RaceCombinedA_.id, equals (id)))
                                           (props.combinedRaces)

                             case Category.SPECIAL_ABILITIES:
                               return lookup (id) (props.specialAbilities)

                             case Category.SPELLS:
                               return lookup (id) (props.spells)

                             case Category.SKILLS:
                               return lookup (id) (props.skills)

                             default:
                               return Nothing
                           }
                         })
                         (mcategory)
         })
