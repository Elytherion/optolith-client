// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as IC$OptolithClient from "./IC.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_IntSet$OptolithClient from "../Data/Ley_IntSet.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as SkillCheck$OptolithClient from "./SkillCheck.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";
import * as ActivatableSkill$OptolithClient from "./ActivatableSkill.bs.js";

function nameByTradition(json) {
  return [
          JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json)
        ];
}

function decode(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          nameByTradition: Curry._1(Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.field("nameByTradition", (function (param) {
                      return JsonStrict$OptolithClient.list(nameByTradition, param);
                    }), json)),
          effect: JsonStrict$OptolithClient.field("effect", JsonStrict$OptolithClient.string, json),
          duration: JsonStrict$OptolithClient.field("duration", ActivatableSkill$OptolithClient.MainParameter.decode, json),
          cost: JsonStrict$OptolithClient.field("cost", ActivatableSkill$OptolithClient.MainParameter.decode, json),
          target: JsonStrict$OptolithClient.field("target", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.decodeList, json)
        };
}

var TranslationMap = TranslationMap$OptolithClient.Make({
      decode: decode
    });

function decodeMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          check: JsonStrict$OptolithClient.field("check", SkillCheck$OptolithClient.decode, json),
          skill: JsonStrict$OptolithClient.optionalField("skill", JsonStrict$OptolithClient.$$int, json),
          musicTraditions: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("musicTraditions", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          property: JsonStrict$OptolithClient.field("property", JsonStrict$OptolithClient.$$int, json),
          ic: JsonStrict$OptolithClient.field("ic", IC$OptolithClient.Decode.t, json),
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
                        nameByTradition: translation.nameByTradition,
                        check: x.check,
                        effect: translation.effect,
                        duration: ActivatableSkill$OptolithClient.MainParameter.make(false, translation.duration),
                        cost: ActivatableSkill$OptolithClient.MainParameter.make(false, translation.cost),
                        skill: x.skill,
                        musicTraditions: x.musicTraditions,
                        property: x.property,
                        ic: x.ic,
                        src: PublicationRef$OptolithClient.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

var Dynamic = ActivatableSkill$OptolithClient.Dynamic;

var Static = {
  decode: decode$1
};

export {
  Dynamic ,
  Static ,
  
}
/* TranslationMap Not a pure module */
