import { FC, memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedActiveCantrip } from "../../../../../shared/domain/spellActive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { selectGetProperty } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"

type Props = {
  insertTopMargin?: boolean
  cantrip: DisplayedActiveCantrip
  sortOrder: SpellsSortOrder
  remove: (id: number) => void
}

const ActiveCantripsListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    cantrip: {
      static: { id, property, translations },
      isUnfamiliar,
    },
    sortOrder,
    remove,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)
  const getProperty = useAppSelector(selectGetProperty)

  const { name = "" } = translateMap(translations) ?? {}

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "Cantrip", cantrip: id })),
    [dispatch, id],
  )

  const propertyName = useMemo(
    () => translateMap(getProperty(property.id.property)?.translations)?.name,
    [getProperty, property.id.property, translateMap],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={inlineLibraryEntryId?.tag === "Cantrip" && inlineLibraryEntryId.cantrip === id}
      noIncrease
      unrecommended={isUnfamiliar}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup
        text={
          sortOrder === SpellsSortOrder.Group
            ? `${propertyName} / ${translate("Cantrips")}`
            : propertyName
        }
      />
      <ListItemValues>
        <SkillFill />
      </ListItemValues>
      <SkillButtons
        id={id}
        removePoint={canRemove ? remove : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

/**
 * Displays a cantrip that is currently active.
 */
const MemoActiveCantripsListItem = memo(ActiveCantripsListItem)

export { MemoActiveCantripsListItem as ActiveCantripsListItem }
