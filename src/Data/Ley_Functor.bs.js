// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";

function MakeInfix(Arg) {
  var $less$$great = Arg.fmap;
  var $less$amp$great = function (x, f) {
    return Curry._2($less$$great, f, x);
  };
  var $less$ = function (x, y) {
    return Curry._2(Arg.fmap, (function (param) {
                  return x;
                }), y);
  };
  var $$great = function (x, y) {
    return Curry._2(Arg.fmap, (function (param) {
                  return y;
                }), x);
  };
  return {
          $less$$great: $less$$great,
          $less$amp$great: $less$amp$great,
          $less$: $less$,
          $$great: $$great
        };
}

function Make(Arg) {
  return Arg;
}

export {
  MakeInfix ,
  Make ,
  
}
/* No side effect */
