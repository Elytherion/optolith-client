import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { fromJust, isJust, isNothing, Maybe } from "../../../Data/Maybe"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { AttrId } from "../../Constants/Ids"
import { EditPet } from "../../Models/Hero/EditPet"
import { Attribute } from "../../Models/Wiki/Attribute"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { WikiModel } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe } from "../../Utilities/pipe"
import { AvatarChange } from "../Universal/AvatarChange"
import { AvatarWrapper } from "../Universal/AvatarWrapper"
import { BorderButton } from "../Universal/BorderButton"
import { Slidein } from "../Universal/Slidein"
import { TextField } from "../Universal/TextField"

const EPA = EditPet.A

const getAttrShort =
  (attrs: WikiModel["attributes"]) =>
    pipe (lookupF (attrs), fmap (Attribute.A.short))

export interface PetEditorProps {
  attributes: WikiModel["attributes"]
  petInEditor: Maybe<Record<EditPet>>
  l10n: L10nRecord
  isEditPetAvatarOpen: boolean
  isInCreation: Maybe<boolean>

  closePetEditor (): void
  addPet (): void
  savePet (): void
  openEditPetAvatar (): void
  closeEditPetAvatar (): void

  setAvatar (path: string): void
  deleteAvatar (): void
  setName (name: string): void
  setSize (size: string): void
  setType (type: string): void
  setSpentAp (spentAp: string): void
  setTotalAp (totalAp: string): void
  setCourage (courage: string): void
  setSagacity (sagacity: string): void
  setIntuition (intuition: string): void
  setCharisma (charisma: string): void
  setDexterity (dexterity: string): void
  setAgility (agility: string): void
  setConstitution (constitution: string): void
  setStrength (strength: string): void
  setLp (lp: string): void
  setAe (ae: string): void
  setSpi (spi: string): void
  setTou (tou: string): void
  setPro (pro: string): void
  setIni (ini: string): void
  setMov (mov: string): void
  setAttack (attack: string): void
  setAt (at: string): void
  setPa (pa: string): void
  setDp (dp: string): void
  setReach (reach: string): void
  setActions (actions: string): void
  setSkills (skills: string): void
  setAbilities (abilities: string): void
  setNotes (notes: string): void
}

export function PetEditor (props: PetEditorProps) {
  const {
    attributes,
    petInEditor: mpet_in_editor,
    l10n,
    isEditPetAvatarOpen,
    isInCreation,

    closePetEditor,
    addPet,
    savePet,
    openEditPetAvatar,
    closeEditPetAvatar,

    setAvatar,
    deleteAvatar,
    setName,
    setSize,
    setType,
    setSpentAp,
    setTotalAp,
    setCourage,
    setSagacity,
    setIntuition,
    setCharisma,
    setDexterity,
    setAgility,
    setConstitution,
    setStrength,
    setLp,
    setAe,
    setSpi,
    setTou,
    setPro,
    setIni,
    setMov,
    setAttack,
    setAt,
    setPa,
    setDp,
    setReach,
    setActions,
    setSkills,
    setAbilities,
    setNotes,
  } = props

  if (isJust (mpet_in_editor)) {
    const pet = fromJust (mpet_in_editor)

    return (
      <Slidein isOpen close={closePetEditor}>
        <div className="pet-edit">
          <div className="left">
            <AvatarWrapper src={EPA.avatar (pet)} onClick={openEditPetAvatar} />
            <BorderButton
              className="delete-avatar"
              label={translate (l10n) ("deleteavatar")}
              onClick={deleteAvatar}
              disabled={isNothing (EPA.avatar (pet))}
              />
          </div>
          <div className="right">
            <div className="row">
              <TextField
                label={translate (l10n) ("name")}
                value={EPA.name (pet)}
                onChange={setName}
                />
              <TextField
                label={translate (l10n) ("sizecategory")}
                value={EPA.size (pet)}
                onChange={setSize}
                />
              <TextField
                label={translate (l10n) ("type")}
                value={EPA.type (pet)}
                onChange={setType}
                />
              <TextField
                label={translate (l10n) ("apspent.novar")}
                value={EPA.spentAp (pet)}
                onChange={setSpentAp}
                />
              <TextField
                label={translate (l10n) ("totalap.novar")}
                value={EPA.totalAp (pet)}
                onChange={setTotalAp}
                />
            </div>
            <div className="row">
              <TextField
                label={getAttrShort (attributes) (AttrId.Courage)}
                value={EPA.cou (pet)}
                onChange={setCourage}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Sagacity)}
                value={EPA.sgc (pet)}
                onChange={setSagacity}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Intuition)}
                value={EPA.int (pet)}
                onChange={setIntuition}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Charisma)}
                value={EPA.cha (pet)}
                onChange={setCharisma}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Dexterity)}
                value={EPA.dex (pet)}
                onChange={setDexterity}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Agility)}
                value={EPA.agi (pet)}
                onChange={setAgility}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Constitution)}
                value={EPA.con (pet)}
                onChange={setConstitution}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Strength)}
                value={EPA.str (pet)}
                onChange={setStrength}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (l10n) ("lifepoints.short")}
                value={EPA.lp (pet)}
                onChange={setLp}
                />
              <TextField
                label={translate (l10n) ("arcaneenergy.short")}
                value={EPA.ae (pet)}
                onChange={setAe}
                />
              <TextField
                label={translate (l10n) ("spirit.short")}
                value={EPA.spi (pet)}
                onChange={setSpi}
                />
              <TextField
                label={translate (l10n) ("toughness.short")}
                value={EPA.tou (pet)}
                onChange={setTou}
                />
              <TextField
                label={translate (l10n) ("protection.short")}
                value={EPA.pro (pet)}
                onChange={setPro}
                />
              <TextField
                label={translate (l10n) ("initiative.short")}
                value={EPA.ini (pet)}
                onChange={setIni}
                />
              <TextField
                label={translate (l10n) ("movement.short")}
                value={EPA.mov (pet)}
                onChange={setMov}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (l10n) ("attack")}
                value={EPA.attack (pet)}
                onChange={setAttack}
                />
              <TextField
                label={translate (l10n) ("attack.short")}
                value={EPA.at (pet)}
                onChange={setAt}
                />
              <TextField
                label={translate (l10n) ("parry.short")}
                value={EPA.pa (pet)}
                onChange={setPa}
                />
              <TextField
                label={translate (l10n) ("damagepoints.short")}
                value={EPA.dp (pet)}
                onChange={setDp}
                />
              <TextField
                label={translate (l10n) ("reach")}
                value={EPA.reach (pet)}
                onChange={setReach}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (l10n) ("actions")}
                value={EPA.actions (pet)}
                onChange={setActions}
                />
              <TextField
                label={translate (l10n) ("skills")}
                value={EPA.talents (pet)}
                onChange={setSkills}
                />
              <TextField
                label={translate (l10n) ("specialabilities")}
                value={EPA.skills (pet)}
                onChange={setAbilities}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (l10n) ("notes")}
                value={EPA.notes (pet)}
                onChange={setNotes}
                />
            </div>
            {Maybe.elem (true) (isInCreation)
              ? (
                <BorderButton
                  label={translate (l10n) ("add")}
                  onClick={addPet}
                  />
              )
              : (
                <BorderButton
                  label={translate (l10n) ("save")}
                  onClick={savePet}
                  />
              )}
          </div>
        </div>
        <AvatarChange
          l10n={l10n}
          setPath={setAvatar}
          close={closeEditPetAvatar}
          isOpen={isEditPetAvatarOpen}
          />
      </Slidein>
    )
  }

  return null
}
