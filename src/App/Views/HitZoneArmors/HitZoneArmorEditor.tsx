import * as React from "react";
import { equals } from "../../../Data/Eq";
import { ident } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { append, consF, List } from "../../../Data/List";
import { ensure, mapMaybe, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { EditHitZoneArmor } from "../../Models/Hero/EditHitZoneArmor";
import { Item, itemToDropdown } from "../../Models/Hero/Item";
import { ItemTemplate, itemTemplateToDropdown } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { getLossLevelElements } from "../../Utilities/ItemUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Dialog } from "../Universal/Dialog";
import { DropdownOption } from "../Universal/Dropdown";
import { TextField } from "../Universal/TextField";
import { HitZoneArmorEditorRow } from "./HitZoneArmorEditorRow";

export interface HitZoneArmorEditorProps {
  armorZonesEditor: Record<EditHitZoneArmor>
  isInHitZoneArmorCreation: Maybe<boolean>
  l10n: L10nRecord
  items: Maybe<List<Record<Item>>>
  templates: List<Record<ItemTemplate>>
  addToList (): void
  closeEditor (): void
  saveItem (): void
  setName (value: string): void
  setHead (id: Maybe<string>): void
  setHeadLoss (id: Maybe<number>): void
  setLeftArm (id: Maybe<string>): void
  setLeftArmLoss (id: Maybe<number>): void
  setLeftLeg (id: Maybe<string>): void
  setLeftLegLoss (id: Maybe<number>): void
  setTorso (id: Maybe<string>): void
  setTorsoLoss (id: Maybe<number>): void
  setRightArm (id: Maybe<string>): void
  setRightArmLoss (id: Maybe<number>): void
  setRightLeg (id: Maybe<string>): void
  setRightLegLoss (id: Maybe<number>): void
}

const IA = Item.A
const ITA = ItemTemplate.A
const EHZAA = EditHitZoneArmor.A

export function HitZoneArmorEditor (props: HitZoneArmorEditorProps) {
  const {
    armorZonesEditor,
    closeEditor,
    isInHitZoneArmorCreation,
    items: mitems,
    l10n,
    templates,
    addToList,
    saveItem,
    setHead,
    setHeadLoss,
    setLeftArm,
    setLeftArmLoss,
    setLeftLeg,
    setLeftLegLoss,
    setName,
    setRightArm,
    setRightArmLoss,
    setRightLeg,
    setRightLegLoss,
    setTorso,
    setTorsoLoss,
  } = props

  const armorList =
    pipe_ (
      templates,
      mapMaybe (pipe (ensure (pipe (ITA.gr, equals (4))), fmap (itemTemplateToDropdown))),
      maybe (ident as ident<List<Record<DropdownOption<string>>>>)
            (pipe (
              mapMaybe (pipe (
                ensure ((e: Record<Item>) => IA.gr (e) === 4 && !IA.isTemplateLocked (e)),
                fmap (itemToDropdown)
              )),
              append
            ))
            (mitems),
      sortRecordsByName (l10n),
      consF (DropdownOption ({ name: translate (l10n) ("none") }))
    )

  const lossLevels = getLossLevelElements ()

  return (
    <Dialog
      id="armor-zones-editor"
      title={
        Maybe.elem (true) (isInHitZoneArmorCreation)
          ? translate (l10n) ("createhitzonearmor")
          : translate (l10n) ("edithitzonearmor")
      }
      isOpen
      close={closeEditor}
      buttons={[
        {
          autoWidth: true,
          disabled: EHZAA.name (armorZonesEditor) === "",
          label: translate (l10n) ("save"),
          onClick: Maybe.elem (true) (isInHitZoneArmorCreation) ? addToList : saveItem,
        },
      ]}
      >
      <div className="main">
        <div className="row">
          <TextField
            className="name"
            label={translate (l10n) ("name")}
            value={EHZAA.name (armorZonesEditor)}
            onChange={setName}
            autoFocus={Maybe.elem (true) (isInHitZoneArmorCreation)}
            />
        </div>
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.head (armorZonesEditor)}
          componentLoss={EHZAA.headLoss (armorZonesEditor)}
          l10n={l10n}
          lossLevels={lossLevels}
          name="head"
          setComponent={setHead}
          setComponentLoss={setHeadLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.torso (armorZonesEditor)}
          componentLoss={EHZAA.torsoLoss (armorZonesEditor)}
          l10n={l10n}
          lossLevels={lossLevels}
          name="torso"
          setComponent={setTorso}
          setComponentLoss={setTorsoLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.leftArm (armorZonesEditor)}
          componentLoss={EHZAA.leftArmLoss (armorZonesEditor)}
          l10n={l10n}
          lossLevels={lossLevels}
          name="leftarm"
          setComponent={setLeftArm}
          setComponentLoss={setLeftArmLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.rightArm (armorZonesEditor)}
          componentLoss={EHZAA.rightArmLoss (armorZonesEditor)}
          l10n={l10n}
          lossLevels={lossLevels}
          name="rightarm"
          setComponent={setRightArm}
          setComponentLoss={setRightArmLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.leftLeg (armorZonesEditor)}
          componentLoss={EHZAA.leftLegLoss (armorZonesEditor)}
          l10n={l10n}
          lossLevels={lossLevels}
          name="leftleg"
          setComponent={setLeftLeg}
          setComponentLoss={setLeftLegLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.rightLeg (armorZonesEditor)}
          componentLoss={EHZAA.rightLegLoss (armorZonesEditor)}
          l10n={l10n}
          lossLevels={lossLevels}
          name="rightleg"
          setComponent={setRightLeg}
          setComponentLoss={setRightLegLoss}
          />
      </div>
    </Dialog>
  )
}
