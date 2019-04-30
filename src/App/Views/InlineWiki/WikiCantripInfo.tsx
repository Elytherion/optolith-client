import * as React from "react";
import { Book, Cantrip } from "../../Models/Wiki/wikiTypeHelpers";
import { translate, UIMessages } from "../../Utilities/I18n";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiCantripInfoProps {
  books: Map<string, Book>
  currentObject: Cantrip
  locale: UIMessages
}

export function WikiCantripInfo(props: WikiCantripInfoProps) {
  const { currentObject, locale } = props

  if (["nl-BE"].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="cantrip" title={currentObject.name}>
        <WikiProperty l10n={locale} title="info.property">
          {translate(locale, "spells.view.properties")[currentObject.property - 1]}
        </WikiProperty>
      </WikiBoxTemplate>
    )
  }

  return (
    <WikiBoxTemplate className="cantrip" title={currentObject.name}>
      <Markdown className="no-indent" source={currentObject.effect} />
      <WikiProperty l10n={locale} title="info.range">{currentObject.range}</WikiProperty>
      <WikiProperty l10n={locale} title="info.duration">{currentObject.duration}</WikiProperty>
      <WikiProperty l10n={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
      <WikiProperty l10n={locale} title="info.property">
        {translate(locale, "spells.view.properties")[currentObject.property - 1]}
      </WikiProperty>
      {currentObject.note && <WikiProperty l10n={locale} title="info.note">{currentObject.note}</WikiProperty>}
      <WikiSource {...props} />
    </WikiBoxTemplate>
  )
}
