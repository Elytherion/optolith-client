import * as React from "react"
import { not } from "../../../Data/Bool"
import { notEquals } from "../../../Data/Eq"
import { cnst } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { flength, List, notNullStr } from "../../../Data/List"
import { bindF, ensure, fromJust, isJust, isNothing, Just, mapMaybe, Maybe, maybe, maybeToNullable, maybe_, Nothing } from "../../../Data/Maybe"
import { add, dec, gt, inc, subtract } from "../../../Data/Num"
import { adjust, alter, lookup, lookupF, OrderedMap, size } from "../../../Data/OrderedMap"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { first, fst, Pair, second, snd } from "../../../Data/Tuple"
import { sel2 } from "../../../Data/Tuple/Select"
import { ProfessionId } from "../../Constants/Ids"
import { Selections as SelectionsInterface } from "../../Models/Hero/heroTypeHelpers"
import { Rules } from "../../Models/Hero/Rules"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { Attribute } from "../../Models/Wiki/Attribute"
import { Culture } from "../../Models/Wiki/Culture"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { Profession } from "../../Models/Wiki/Profession"
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection"
import { ProfessionSelections } from "../../Models/Wiki/professionSelections/ProfessionAdjustmentSelections"
import { CombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection"
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant"
import { Race } from "../../Models/Wiki/Race"
import { Skill } from "../../Models/Wiki/Skill"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { ProfessionSelectionIds } from "../../Models/Wiki/wikiTypeHelpers"
import { translate } from "../../Utilities/I18n"
import { getAllAdjustmentSelections } from "../../Utilities/mergeRcpAdjustmentSelections"
import { sign } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { getBuyScriptElement, getGuildMageUnfamiliarSpellSelectionElement, getMainScriptSelectionElement, getMotherTongueSelectionElement } from "../../Utilities/rcpAdjustmentSelectionUtils"
import { getSelPair } from "../../Utilities/RCPSelectionsUtils"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"
import { Scroll } from "../Universal/Scroll"
import { Slidein } from "../Universal/Slidein"
import { CantripSelectionList, isCantripsSelectionValid } from "./CantripSelectionList"
import { CombatTechniqueSelectionList, getFirstCombatTechniques, getSecondCombatTechniques, isFirstCombatTechniqueSelectionValid, isSecondCombatTechniqueSelectionValid } from "./CombatTechniqueSelectionList"
import { CursesSelectionList, isCursesSelectionValid } from "./CursesSelectionList"
import { isLanguagesScriptsSelectionValid, LanguagesScriptsSelectionLists } from "./LanguagesScriptsSelectionLists"
import { isSkillSelectionValid, SkillSelectionList } from "./SkillSelectionList"
import { isSkillSpecializationSelectionValid, SkillSpecializationSelectionList } from "./SkillSpecializationSelectionList"
import { isTerrainKnowledgeSelectionValid, TerrainKnowledgeSelectionList } from "./TerrainKnowledgeSelectionList"

export interface RCPOptionSelectionsProps {
  l10n: L10nRecord
  race: Record<Race>
  culture: Record<Culture>
  profession: Record<Profession>
  professionVariant: Maybe<Record<ProfessionVariant>>
  wiki: WikiModelRecord
  munfamiliar_spells: Maybe<List<Record<DropdownOption>>>
  rules: Record<Rules>
  close (): void
  setSelections (selections: SelectionsInterface): void
}

const AttrA = Attribute.A
const PSA = ProfessionSelections.A

export const RCPOptionSelections: React.FC<RCPOptionSelectionsProps> = props => {
  const {
    close,
    race,
    culture,
    profession,
    professionVariant,
    l10n,
    rules,
    wiki,
    munfamiliar_spells,
    setSelections,
  } = props

  const [ attributeAdjustment, setAttributeAdjustment ] = React.useState<Maybe<string>> (Nothing)
  const [ useCulturePackage, setUseCulturePackage ] = React.useState<boolean> (false)
  const [ motherTongue, setMotherTongue ] = React.useState<number> (0)
  const [ isBuyingMainScriptEnabled, setIsBuyingMainScriptEnabled ] =
    React.useState<boolean> (false)
  const [ mainScript, setMainScript ] = React.useState<number> (0)
  const [ cantripsActive, setCantrips ] = React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [ combatTechniquesActive, setCombatTechniques ] =
    React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [ combatTechniquesSecondActive, setCombatTechniquesSecond ] =
    React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [ cursesActive, setCurses ] = React.useState<OrderedMap<string, number>> (OrderedMap.empty)
  const [ languagesActive, setLanguages ] =
    React.useState<OrderedMap<number, number>> (OrderedMap.empty)
  const [ scriptsActive, setScripts ] =
    React.useState<OrderedMap<number, number>> (OrderedMap.empty)
  const [ skillsActive, setSkills ] = React.useState<OrderedMap<string, number>> (OrderedMap.empty)

  // first: selection id, second: user input
  const [ specialization, setSpecialization ] =
    React.useState<Pair<Maybe<number>, string>> (Pair (Nothing, ""))
  const [ specializationSkillId, setSpecializationSkillId ] =
    React.useState<Maybe<string>> (Nothing)
  const [ terrainKnowledgeActive, setTerrainKnowledge ] = React.useState<Maybe<number>> (Nothing)
  const [ selectedUnfamiliarSpell, setSelectedUnfamiliarSpell ] =
    React.useState<Maybe<string>> (Nothing)

  const handleSetAttributeAdjustment = React.useCallback (
    (option: string) => setAttributeAdjustment (Just (option)),
    []
  )

  const handleSwitchIsCulturalPackageEnabled = React.useCallback (
    () => setUseCulturePackage (not),
    []
  )

  const handleSwitchIsBuyingMainScriptEnabled = React.useCallback (
    () => setIsBuyingMainScriptEnabled (not),
    []
  )

  const handleSwitchCantrip = React.useCallback (
    (id: string) => setCantrips (OrderedSet.toggle (id)),
    []
  )

  const handleSwitchCombatTechnique = React.useCallback (
    (id: string) => setCombatTechniques (OrderedSet.toggle (id)),
    []
  )

  const handleSwitchSecondCombatTechnique = React.useCallback (
    (id: string) => setCombatTechniquesSecond (OrderedSet.toggle (id)),
    []
  )

  const handleAdjustCurse = React.useCallback (
    (id: string) => (moption: Maybe<"add" | "remove">) => {
      if (isJust (moption)) {
        const option = fromJust (moption)

        if (option === "add") {
          setCurses (adjust (inc) (id))
        }
        else {
          setCurses (adjust (dec) (id))
        }
      }
      else {
        setCurses (alter (maybe<Maybe<number>> (Just (0)) (cnst (Nothing)))
                         (id))
      }
    },
    []
  )

  const handleAdjustLanguage = React.useCallback (
    (id: number) => (level: Maybe<number>) => {
      setLanguages (alter (cnst (level)) (id))
    },
    []
  )

  const handleToggleScript = React.useCallback (
    (id: number) => (ap: number) => {
      setScripts (alter (maybe<Maybe<number>> (Just (ap)) (cnst (Nothing)))
                        (id))
    },
    []
  )

  const handleSetSpecializationSkill = React.useCallback (
    (id: string) => {
      setSpecialization (Pair<Maybe<number>, string> (Nothing, ""))
      setSpecializationSkillId (Just (id))
    },
    []
  )

  const handleSetSpecializationApplicationId = React.useCallback (
    (value: number) => {
      setSpecialization (first (() => Just (value)))
    },
    []
  )

  const handleSetSpecializationApplicationString = React.useCallback (
    (value: string) => {
      setSpecialization (second (() => value))
    },
    []
  )

  const handleAddSkillPoint = React.useCallback (
    (id: string) => {
      setSkills (alter ((skill: Maybe<number>) =>
                         pipe_ (
                           wiki,
                           WikiModel.A.skills,
                           lookup (id),
                           fmap (pipe (Skill.A.ic, add (Maybe.sum (skill))))
                         ))
                       (id))
    },
    [ wiki ]
  )

  const handleRemoveSkillPoint = React.useCallback (
    (id: string) => {
      setSkills (alter ((skill: Maybe<number>) =>
                         pipe_ (
                           wiki,
                           WikiModel.A.skills,
                           lookup (id),
                           bindF (pipe (Skill.A.ic, subtract (Maybe.sum (skill)), ensure (gt (0))))
                         ))
                       (id))
    },
    [ wiki ]
  )

  const handleSetTerrainKnowledge = React.useCallback (
    (terrainKnowledge: number) => setTerrainKnowledge (Just (terrainKnowledge)),
    []
  )

  const handleSetGuildMageUnfamiliarSpellId = React.useCallback (
    (id: string) => setSelectedUnfamiliarSpell (Just (id)),
    []
  )

  const prof_sels = getAllAdjustmentSelections (profession) (professionVariant)

  const handleConfirmSelections = React.useCallback (
    () => {
      if (isJust (attributeAdjustment)) {
        setSelections ({
          attributeAdjustment: fromJust (attributeAdjustment),
          useCulturePackage,
          motherTongue,
          isBuyingMainScriptEnabled,
          mainScript,
          cantrips: cantripsActive,
          combatTechniques: combatTechniquesActive,
          combatTechniquesSecond: combatTechniquesSecondActive,
          curses: cursesActive,
          languages: languagesActive,
          scripts: scriptsActive,
          skills: skillsActive,
          specializationSkillId,
          terrainKnowledge: terrainKnowledgeActive,
          map: prof_sels,
          specialization:
            maybe_ <Maybe<string | number>> (() => fst (specialization))
                                            (Just as (x: string) => Just<string>)
                                            (ensure (notNullStr) (snd (specialization))),
          unfamiliarSpell: selectedUnfamiliarSpell,
        })
      }
    },
    [
      attributeAdjustment,
      cantripsActive,
      combatTechniquesActive,
      combatTechniquesSecondActive,
      cursesActive,
      isBuyingMainScriptEnabled,
      languagesActive,
      mainScript,
      motherTongue,
      prof_sels,
      scriptsActive,
      selectedUnfamiliarSpell,
      setSelections,
      skillsActive,
      specialization,
      specializationSkillId,
      terrainKnowledgeActive,
      useCulturePackage,
    ]
  )

  const attributeAdjustmentSelection = Race.A.attributeAdjustmentsSelection (race)
  const attributeAdjustmentValue = fst (attributeAdjustmentSelection)
  const signed_attr_ajst_val = sign (attributeAdjustmentValue)

  const isMotherTongueSelectionNeeded = flength (Culture.A.languages (culture)) > 1

  const scriptsListLength = flength (Culture.A.scripts (culture))

  /**
   * `Tuple.fst` – if the culture has any script
   *
   * `Tuple.snd` – if the culture has multiple possible scripts
   */
  const isScriptSelectionNeeded = Pair (scriptsListLength > 0, scriptsListLength > 1)

  const isAnyLanguageOrScriptSelected = size (languagesActive) > 0 || size (scriptsActive) > 0

  const buyScriptElement = getBuyScriptElement (l10n)
                                               (wiki)
                                               (culture)
                                               (isScriptSelectionNeeded)
                                               (isBuyingMainScriptEnabled)
                                               (isAnyLanguageOrScriptSelected)
                                               (handleSwitchIsBuyingMainScriptEnabled)

  const languagesAndScripts =
    getSelPair (isLanguagesScriptsSelectionValid (languagesActive) (scriptsActive))
               ((selection, res) => (
                 <LanguagesScriptsSelectionLists
                   l10n={l10n}
                   wiki={wiki}
                   rules={rules}
                   ap_left={sel2 (res)}
                   culture={culture}
                   isBuyingMainScriptEnabled={isBuyingMainScriptEnabled}
                   isMotherTongueSelectionNeeded={isMotherTongueSelectionNeeded}
                   isScriptSelectionNeeded={isScriptSelectionNeeded}
                   languagesActive={languagesActive}
                   mainScript={mainScript}
                   motherTongue={motherTongue}
                   scriptsActive={scriptsActive}
                   selection={selection}
                   toggleScript={handleToggleScript}
                   adjustLanguage={handleAdjustLanguage}
                   />
               ))
               (PSA[ProfessionSelectionIds.LANGUAGES_SCRIPTS])
               (prof_sels)

  const curses =
    getSelPair (isCursesSelectionValid (cursesActive))
               ((selection, res) => (
                 <CursesSelectionList
                   l10n={l10n}
                   wiki={wiki}
                   rules={rules}
                   active={cursesActive}
                   ap_left={sel2 (res)}
                   selection={selection}
                   adjustCurseValue={handleAdjustCurse}
                   />
               ))
               (PSA[ProfessionSelectionIds.CURSES])
               (prof_sels)

  const combatTechniques =
    getSelPair (isFirstCombatTechniqueSelectionValid (combatTechniquesActive))
               (selection => (
                 <CombatTechniqueSelectionList
                   l10n={l10n}
                   active={combatTechniquesActive}
                   amount={CombatTechniquesSelection.A.amount (selection)}
                   list={getFirstCombatTechniques (wiki) (selection)}
                   value={CombatTechniquesSelection.A.value (selection)}
                   setCombatTechniqueId={handleSwitchCombatTechnique}
                   />
               ))
               (PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES])
               (prof_sels)

  const combatTechniquesSecond =
    getSelPair (isSecondCombatTechniqueSelectionValid (combatTechniquesSecondActive))
               (selection => (
                 <CombatTechniqueSelectionList
                   l10n={l10n}
                   active={combatTechniquesSecondActive}
                   disabled={combatTechniquesActive}
                   amount={CombatTechniquesSecondSelection.A.amount (selection)}
                   list={getSecondCombatTechniques (wiki) (selection)}
                   value={CombatTechniquesSecondSelection.A.value (selection)}
                   second
                   setCombatTechniqueId={handleSwitchSecondCombatTechnique}
                   />
               ))
               (PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
               (prof_sels)

  const cantrips =
    getSelPair (isCantripsSelectionValid (cantripsActive))
               (selection => (
                 <CantripSelectionList
                   l10n={l10n}
                   wiki={wiki}
                   active={cantripsActive}
                   selection={selection}
                   toggleCantripId={handleSwitchCantrip}
                   />
               ))
               (PSA[ProfessionSelectionIds.CANTRIPS])
               (prof_sels)

  const skillSpecialization =
    getSelPair (isSkillSpecializationSelectionValid (specialization)
                                                    (specializationSkillId))
               (selection => (
                 <SkillSpecializationSelectionList
                   activeApplication={specialization}
                   activeSkillId={specializationSkillId}
                   l10n={l10n}
                   selection={selection}
                   setApplicationId={handleSetSpecializationApplicationId}
                   setApplicationString={handleSetSpecializationApplicationString}
                   setSkillId={handleSetSpecializationSkill}
                   wiki={wiki}
                   />
               ))
               (PSA[ProfessionSelectionIds.SPECIALIZATION])
               (prof_sels)

  const skills =
    getSelPair (isSkillSelectionValid (skillsActive))
               ((selection, res) => (
                 <SkillSelectionList
                   l10n={l10n}
                   wiki={wiki}
                   active={skillsActive}
                   ap_left={sel2 (res)}
                   selection={selection}
                   addSkillPoint={handleAddSkillPoint}
                   removeSkillPoint={handleRemoveSkillPoint}
                   />
               ))
               (PSA[ProfessionSelectionIds.SKILLS])
               (prof_sels)

  const terrainKnowledge =
    getSelPair (isTerrainKnowledgeSelectionValid (terrainKnowledgeActive))
               (selection => (
                 <TerrainKnowledgeSelectionList
                   wiki={wiki}
                   active={terrainKnowledgeActive}
                   selection={selection}
                   setTerrainId={handleSetTerrainKnowledge}
                   />
               ))
               (PSA[ProfessionSelectionIds.TERRAIN_KNOWLEDGE])
               (prof_sels)

  const guildMageUnfamiliarSpell =
    getGuildMageUnfamiliarSpellSelectionElement (l10n)
                                                (munfamiliar_spells)
                                                (selectedUnfamiliarSpell)
                                                (handleSetGuildMageUnfamiliarSpellId)
                                                (profession)

  const isConfirmingSelectionsDisabled =
    !fst (skillSpecialization)
    || !fst (languagesAndScripts)
    || !fst (combatTechniques)
    || !fst (combatTechniquesSecond)
    || !fst (cantrips)
    || !fst (curses)
    || !fst (skills)
    || !fst (terrainKnowledge)
    || isNothing (attributeAdjustment)
    || (isMotherTongueSelectionNeeded && motherTongue === 0)
    || (
      isBuyingMainScriptEnabled
      && snd (isScriptSelectionNeeded)
      && mainScript === 0
    )
    || (
      PSA[ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL] (prof_sels)
      && isNothing (selectedUnfamiliarSpell)
    )

  return (
    <Slidein isOpen close={close} className="rcp-selections">
      <Scroll>
        <h3>{translate (l10n) ("race")}</h3>
        <Dropdown
          hint={translate (l10n) ("selectattributeadjustment")}
          value={attributeAdjustment}
          onChangeJust={handleSetAttributeAdjustment}
          options={mapMaybe (pipe (
                              lookupF (WikiModel.A.attributes (wiki)),
                              fmap (attr => DropdownOption ({
                                  id: Just (AttrA.id (attr)),
                                  name: `${AttrA.name (attr)} ${signed_attr_ajst_val}`,
                                }))
                            ))
                            (snd (attributeAdjustmentSelection))}
          />

        <h3>{translate (l10n) ("culture")}</h3>
        <Checkbox
          checked={useCulturePackage}
          onClick={handleSwitchIsCulturalPackageEnabled}
          >
          {translate (l10n) ("buyculturalpackage")}
          {" ("}
          {Culture.A.culturalPackageAdventurePoints (culture)}
          {` ${translate (l10n) ("adventurepoints.short")})`}
        </Checkbox>
        {getMotherTongueSelectionElement (l10n)
                                         (wiki)
                                         (culture)
                                         (isMotherTongueSelectionNeeded)
                                         (motherTongue)
                                         (isAnyLanguageOrScriptSelected)
                                         (setMotherTongue)}
        {maybeToNullable (buyScriptElement)}
        {getMainScriptSelectionElement (l10n)
                                       (wiki)
                                       (culture)
                                       (isScriptSelectionNeeded)
                                       (mainScript)
                                       (isAnyLanguageOrScriptSelected)
                                       (isBuyingMainScriptEnabled)
                                       (setMainScript)}
        {pipe_ (
          profession,
          Profession.A.id,
          notEquals<string> (ProfessionId.CustomProfession)
        )
          ? <h3>{translate (l10n) ("profession")}</h3>
          : null}
        {maybeToNullable (snd (skillSpecialization))}
        {maybeToNullable (snd (languagesAndScripts))}
        {maybeToNullable (snd (combatTechniques))}
        {maybeToNullable (snd (combatTechniquesSecond))}
        {maybeToNullable (snd (curses))}
        {maybeToNullable (guildMageUnfamiliarSpell)}
        {maybeToNullable (snd (cantrips))}
        {maybeToNullable (snd (skills))}
        {maybeToNullable (snd (terrainKnowledge))}
        <BorderButton
          label={translate (l10n) ("complete")}
          primary
          disabled={isConfirmingSelectionsDisabled}
          onClick={handleConfirmSelections}
          />
      </Scroll>
    </Slidein>
  )
}
