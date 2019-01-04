import { List } from "../../structures/List";
import { fromDefault, Record } from "../../structures/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface TerrainKnowledgeSelection {
  id: ProfessionSelectionIds
  sid: List<number>
}

export const TerrainKnowledgeSelection =
  fromDefault<TerrainKnowledgeSelection> ({
    id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE,
    sid: List.empty,
  })

export const isSkillsSelection =
  (obj: AnyProfessionSelection): obj is Record<TerrainKnowledgeSelection> =>
    TerrainKnowledgeSelection.A.id (obj) === ProfessionSelectionIds.TERRAIN_KNOWLEDGE
