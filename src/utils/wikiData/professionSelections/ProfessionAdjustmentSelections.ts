import { Maybe, Nothing } from "../../structures/Maybe";
import { fromDefault, makeLenses, Record } from "../../structures/Record";
import { ProfessionSelectionIds } from "../wikiTypeHelpers";
import { CantripsSelection } from "./CantripsSelection";
import { CursesSelection } from "./CursesSelection";
import { LanguagesScriptsSelection } from "./LanguagesScriptsSelection";
import { VariantCombatTechniquesSelection } from "./RemoveCombatTechniquesSelection";
import { VariantCombatTechniquesSecondSelection } from "./RemoveSecondCombatTechniquesSelection";
import { VariantSpecializationSelection } from "./RemoveSpecializationSelection";
import { SkillsSelection } from "./SkillsSelection";
import { TerrainKnowledgeSelection } from "./TerrainKnowledgeSelection";

export interface ProfessionSelections {
  [ProfessionSelectionIds.CANTRIPS]: Maybe<Record<CantripsSelection>>
  [ProfessionSelectionIds.COMBAT_TECHNIQUES]: Maybe<VariantCombatTechniquesSelection>
  [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND]: Maybe<VariantCombatTechniquesSecondSelection>
  [ProfessionSelectionIds.CURSES]: Maybe<Record<CursesSelection>>
  [ProfessionSelectionIds.LANGUAGES_SCRIPTS]: Maybe<Record<LanguagesScriptsSelection>>
  [ProfessionSelectionIds.SPECIALIZATION]: Maybe<VariantSpecializationSelection>
  [ProfessionSelectionIds.SKILLS]: Maybe<Record<SkillsSelection>>
  [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]: Maybe<Record<TerrainKnowledgeSelection>>
}

export const ProfessionSelections =
  fromDefault<ProfessionSelections> ({
    [ProfessionSelectionIds.CANTRIPS]: Nothing,
    [ProfessionSelectionIds.COMBAT_TECHNIQUES]: Nothing,
    [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND]: Nothing,
    [ProfessionSelectionIds.CURSES]: Nothing,
    [ProfessionSelectionIds.LANGUAGES_SCRIPTS]: Nothing,
    [ProfessionSelectionIds.SPECIALIZATION]: Nothing,
    [ProfessionSelectionIds.SKILLS]: Nothing,
    [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]: Nothing,
  })

export const ProfessionSelectionsL = makeLenses (ProfessionSelections)
