// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as ClassNames$OptolithClient from "../../../Utilities/ClassNames.bs.js";
import * as Ley_Option$OptolithClient from "../../../Data/Ley_Option.bs.js";

function Avatar(Props) {
  var className = Props.className;
  var overlay = Props.overlay;
  var src = Props.src;
  var onClick = Props.onClick;
  var alt = Props.alt;
  return React.createElement("div", {
              className: ClassNames$OptolithClient.fold({
                    hd: Curry._1(Ley_Option$OptolithClient.$$return, "avatar-wrapper"),
                    tl: {
                      hd: className,
                      tl: /* [] */0
                    }
                  }),
              onClick: onClick
            }, Ley_Option$OptolithClient.fromOption(null, overlay), React.createElement("img", {
                  className: "avatar",
                  alt: alt,
                  src: src
                }));
}

var make = Avatar;

export {
  make ,
  
}
/* react Not a pure module */
