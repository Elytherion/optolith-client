// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";

function decode(json) {
  return {
          date: Json_decode.field("id", Json_decode.date, json),
          description: Json_decode.field("id", Json_decode.string, json)
        };
}

function decodeList(json) {
  return Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.maybe((function (param) {
                    return Json_decode.list(decode, param);
                  }), json));
}

export {
  decodeList ,
  
}
/* Ley_Option-OptolithClient Not a pure module */
