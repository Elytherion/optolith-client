import * as React from "react"
import { fmapF } from "../../../Data/Functor"
import { Maybe, or } from "../../../Data/Maybe"
import { lte } from "../../../Data/Num"
import { Record } from "../../../Data/Record"
import { AttributeWithRequirements, AttributeWithRequirementsA_ } from "../../Models/View/AttributeWithRequirements"
import { IconButton } from "../Universal/IconButton"
import { NumberBox } from "../Universal/NumberBox"
import { AttributeBorder } from "./AttributeBorder"

export interface AttributeListItemProps {
  attribute: Record<AttributeWithRequirements>
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
  maxTotalAttributeValues: Maybe<number>
  sum: number
  addPoint (id: string): void
  removePoint (id: string): void
}

const AWRA = AttributeWithRequirements.A
const AWRA_ = AttributeWithRequirementsA_

export const AttributeListItem: React.FC<AttributeListItemProps> = props => {
  const {
    attribute: attr,
    isInCharacterCreation,
    isRemovingEnabled,
    maxTotalAttributeValues,
    sum,
    addPoint,
    removePoint,
  } = props

  const id = AWRA_.id (attr)
  const value = AWRA_.value (attr)
  const mmax = AWRA.max (attr)

  const valueHeader = isInCharacterCreation ? `${value} / ${Maybe.sum (mmax)}` : value

  const handleAdd = React.useCallback (
    () => addPoint (id),
    [ addPoint, id ]
  )

  const handleRemove = React.useCallback (
    () => removePoint (id),
    [ removePoint, id ]
  )

  return (
    <AttributeBorder
      className={id}
      label={AWRA_.short (attr)}
      value={value}
      tooltip={
        <div className="calc-attr-overlay">
          <h4>
            <span>{AWRA_.name (attr)}</span>
            <span>{valueHeader}</span>
          </h4>
        </div>
      }
      tooltipMargin={11}
      >
      {isInCharacterCreation ? <NumberBox max={Maybe.sum (mmax)} /> : null}
      <IconButton
        className="add"
        icon="&#xE908;"
        onClick={handleAdd}
        disabled={
          (isInCharacterCreation && sum >= Maybe.sum (maxTotalAttributeValues))
          || or (fmapF (mmax) (lte (value)))
        }
        />
      {isRemovingEnabled
        ? (
            <IconButton
              className="remove"
              icon="&#xE909;"
              onClick={handleRemove}
              disabled={value <= AWRA.min (attr)}
              />
          )
        : null}
    </AttributeBorder>
  )
}
