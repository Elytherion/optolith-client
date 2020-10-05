// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as IO$OptolithClient from "../Data/IO.bs.js";
import * as Locale$OptolithClient from "./Locale.bs.js";
import * as Yaml_Raw$OptolithClient from "./Yaml_Raw.bs.js";
import * as Exception$OptolithClient from "../Data/Exception.bs.js";
import * as Yaml_Decode$OptolithClient from "./Yaml_Decode.bs.js";

function parseStaticData(onProgress, langs) {
  console.time("parseStaticData");
  var preferredLocale = Locale$OptolithClient.getPreferred(langs);
  return Exception$OptolithClient.handleE(Curry._2(IO$OptolithClient.Infix.$great$great$eq, Curry._2(IO$OptolithClient.Infix.$less$amp$great, Yaml_Raw$OptolithClient.parseUI(preferredLocale), (function (param) {
                        return Yaml_Decode$OptolithClient.decodeUI(preferredLocale, param);
                      })), (function (ui) {
                    var $$static = function (param) {
                      return Yaml_Decode$OptolithClient.decodeFiles(langs, ui, param);
                    };
                    return Curry._2(IO$OptolithClient.Infix.$less$amp$great, Yaml_Raw$OptolithClient.parseFiles(onProgress), (console.log("Parsing static data done!"), console.timeEnd("parseStaticData"), $$static));
                  })));
}

var Decode;

var Raw;

export {
  Decode ,
  Raw ,
  parseStaticData ,
  
}
/* IO-OptolithClient Not a pure module */
