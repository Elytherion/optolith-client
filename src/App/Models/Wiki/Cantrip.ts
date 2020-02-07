import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { Property } from "../../Constants/Groups"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { EntryWithCategory } from "./wikiTypeHelpers"

export interface Cantrip {
  "@@name": "Cantrip"
  id: string
  name: string
  property: Property
  tradition: List<number>
  category: Category
  effect: string
  range: string
  duration: string
  target: string
  note: Maybe<string>
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const Cantrip =
  fromDefault ("Cantrip")
              <Cantrip> ({
                id: "",
                name: "",
                property: Property.AntiMagic,
                tradition: List.empty,
                category: Category.CANTRIPS,
                effect: "",
                range: "",
                duration: "",
                target: "",
                note: Nothing,
                src: List.empty,
                errata: List (),
              })

export const isCantrip =
  (r: EntryWithCategory) => Cantrip.AL.category (r) === Category.CANTRIPS
