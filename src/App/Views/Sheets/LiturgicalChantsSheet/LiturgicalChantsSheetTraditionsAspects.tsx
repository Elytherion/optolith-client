import * as React from "react"
import { Maybe } from "../../../../Data/Maybe"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { renderMaybe } from "../../../Utilities/ReactUtils"

interface Props {
  l10n: L10nRecord
  aspects: Maybe<string>
  blessedPrimary: Maybe<string>
  blessedTradition: Maybe<string>
}

export const LiturgicalChantsSheetTraditionsAspects: React.FC<Props> = props => {
  const { aspects, blessedPrimary, blessedTradition, l10n } = props

  return (
    <div className="tradition-aspects">
      <div className="primary">
        <span className="label">
          {translate (l10n) ("primaryattribute")}
        </span>
        <span className="value">{renderMaybe (blessedPrimary)}</span>
      </div>
      <div className="aspects">
        <span className="label">
          {translate (l10n) ("aspects.oneormore")}
        </span>
        <span className="value">
          {renderMaybe (aspects)}
        </span>
      </div>
      <div className="tradition">
        <span className="label">
          {translate (l10n) ("tradition")}
        </span>
        <span className="value">{renderMaybe (blessedTradition)}</span>
      </div>
    </div>
  )
}
