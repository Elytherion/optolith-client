// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "./JsonStrict.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "./TranslationMap.bs.js";

var Dynamic = {};

function decode(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          description: JsonStrict$OptolithClient.optionalField("description", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.decodeList, json)
        };
}

var Translations = {
  decode: decode
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translations);

function decodeMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.decodeMultilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.decode, json)
        };
}

function decode$1(langs, json) {
  var x = decodeMultilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        description: translation.description,
                        src: PublicationRef$OptolithClient.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

var Static = {
  decode: decode$1
};

export {
  Dynamic ,
  Static ,
  
}
/* TranslationMap Not a pure module */
