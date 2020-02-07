import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List, map, notNull, toArray } from "../../../Data/List"
import { bindF, ensure, isJust, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { EditHitZoneArmor } from "../../Models/Hero/EditHitZoneArmor"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { HitZoneArmor } from "../../Models/Hero/HitZoneArmor"
import { Item } from "../../Models/Hero/Item"
import { Purse } from "../../Models/Hero/Purse"
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { PurseAndTotals } from "../Equipment/PurseAndTotals"
import { Aside } from "../Universal/Aside"
import { BorderButton } from "../Universal/BorderButton"
import { ListView } from "../Universal/List"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { HitZoneArmorEditor } from "./HitZoneArmorEditor"
import { HitZoneArmorsListItem } from "./HitZoneArmorsListItem"

export interface HitZoneArmorsOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface HitZoneArmorsStateProps {
  armorZones: Maybe<List<Record<HitZoneArmor>>>
  carryingCapacity: number
  initialStartingWealth: number
  items: Maybe<List<Record<Item>>>
  isInHitZoneArmorCreation: Maybe<boolean>
  armorZonesEditor: Maybe<Record<EditHitZoneArmor>>
  hasNoAddedAP: boolean
  purse: Maybe<Record<Purse>>
  templates: List<Record<ItemTemplate>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  filterText: string
}

export interface HitZoneArmorsDispatchProps {
  addToList (): void
  createItem (): void
  editItem (id: string): void
  deleteItem (id: string): void
  closeEditor (): void
  saveItem (): void
  setDucates (value: string): void
  setSilverthalers (value: string): void
  setHellers (value: string): void
  setKreutzers (value: string): void
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
  setFilterText (filterText: string): void
}

export type HitZoneArmorsProps =
  HitZoneArmorsStateProps
  & HitZoneArmorsDispatchProps
  & HitZoneArmorsOwnProps

const HZAA = HitZoneArmor.A

export const HitZoneArmors: React.FC<HitZoneArmorsProps> = props => {
  const {
    l10n,
    armorZones,
    carryingCapacity,
    initialStartingWealth,
    items,
    isInHitZoneArmorCreation,
    armorZonesEditor,
    hasNoAddedAP,
    purse,
    templates,
    totalPrice,
    totalWeight,
    filterText,
    addToList,
    createItem,
    editItem,
    deleteItem,
    closeEditor,
    saveItem,
    setDucates,
    setSilverthalers,
    setHellers,
    setKreutzers,
    setName,
    setHead,
    setHeadLoss,
    setLeftArm,
    setLeftArmLoss,
    setLeftLeg,
    setLeftLegLoss,
    setTorso,
    setTorsoLoss,
    setRightArm,
    setRightArmLoss,
    setRightLeg,
    setRightLegLoss,
    setFilterText,
  } = props

  return (
    <Page id="armor-zones">
      <Options>
        <SearchField
          l10n={l10n}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <BorderButton
          label={translate (l10n) ("create")}
          onClick={createItem}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (l10n) ("name")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {
              Maybe.fromMaybe<NonNullable<React.ReactNode>>
                (
                  <ListPlaceholder
                    l10n={l10n}
                    type="zoneArmor"
                    noResults={filterText.length > 0}
                    />
                )
                (pipe_ (
                  armorZones,
                  bindF (ensure (notNull)),
                  fmap (pipe (
                    map (x => (
                      <HitZoneArmorsListItem
                        key={HZAA.id (x)}
                        data={x}
                        items={items}
                        templates={templates}
                        editItem={editItem}
                        deleteItem={deleteItem}
                        />
                    )),
                    toArray
                  ))
                ))
            }
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <PurseAndTotals
          carryingCapacity={carryingCapacity}
          hasNoAddedAP={hasNoAddedAP}
          initialStartingWealth={initialStartingWealth}
          l10n={l10n}
          purse={purse}
          totalPrice={totalPrice}
          totalWeight={totalWeight}
          setDucates={setDucates}
          setSilverthalers={setSilverthalers}
          setHellers={setHellers}
          setKreutzers={setKreutzers}
          />
      </Aside>
      {
        isJust (armorZonesEditor)
          ? (
            <HitZoneArmorEditor
              armorZonesEditor={Maybe.fromJust (armorZonesEditor)}
              isInHitZoneArmorCreation={isInHitZoneArmorCreation}
              l10n={l10n}
              items={items}
              templates={templates}
              addToList={addToList}
              closeEditor={closeEditor}
              saveItem={saveItem}
              setName={setName}
              setHead={setHead}
              setHeadLoss={setHeadLoss}
              setLeftArm={setLeftArm}
              setLeftArmLoss={setLeftArmLoss}
              setLeftLeg={setLeftLeg}
              setLeftLegLoss={setLeftLegLoss}
              setTorso={setTorso}
              setTorsoLoss={setTorsoLoss}
              setRightArm={setRightArm}
              setRightArmLoss={setRightArmLoss}
              setRightLeg={setRightLeg}
              setRightLegLoss={setRightLegLoss}
              />
          )
          : null
      }
    </Page>
  )
}
