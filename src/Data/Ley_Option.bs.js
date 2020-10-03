// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as List from "bs-platform/lib/es6/list.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";
import * as Caml_option from "bs-platform/lib/es6/caml_option.js";
import * as Ley_Monad$OptolithClient from "./Ley_Monad.bs.js";
import * as Ley_Functor$OptolithClient from "./Ley_Functor.bs.js";
import * as Ley_Foldable$OptolithClient from "./Ley_Foldable.bs.js";
import * as Ley_Function$OptolithClient from "./Ley_Function.bs.js";
import * as Ley_Applicative$OptolithClient from "./Ley_Applicative.bs.js";

function fmap(f, mx) {
  if (mx !== undefined) {
    return Caml_option.some(Curry._1(f, Caml_option.valFromOption(mx)));
  }
  
}

var include = Ley_Functor$OptolithClient.Make({
      fmap: fmap
    });

var fmap$1 = include.fmap;

function pure(x) {
  return Caml_option.some(x);
}

function ap(mf, mx) {
  if (mf !== undefined) {
    return Curry._2(fmap$1, mf, mx);
  }
  
}

var include$1 = Ley_Applicative$OptolithClient.Make({
      fmap: fmap$1,
      pure: pure,
      ap: ap
    });

var pure$1 = include$1.pure;

function alt(mx, my) {
  if (mx !== undefined) {
    return mx;
  } else {
    return my;
  }
}

var include$2 = Ley_Applicative$OptolithClient.Alternative.Make({
      empty: undefined,
      alt: alt
    });

function bind(f, mx) {
  if (mx !== undefined) {
    return Curry._1(f, Caml_option.valFromOption(mx));
  }
  
}

var include$3 = Ley_Monad$OptolithClient.Make({
      pure: pure$1,
      fmap: fmap$1,
      bind: bind
    });

function foldr(f, init, mx) {
  if (mx !== undefined) {
    return Curry._2(f, Caml_option.valFromOption(mx), init);
  } else {
    return init;
  }
}

function foldl(f, init, mx) {
  if (mx !== undefined) {
    return Curry._2(f, init, Caml_option.valFromOption(mx));
  } else {
    return init;
  }
}

var include$4 = Ley_Foldable$OptolithClient.Make({
      foldr: foldr,
      foldl: foldl
    });

var toList = include$4.toList;

function sappend(mxs, mys) {
  if (mxs !== undefined && mys !== undefined) {
    return List.append(mxs, mys);
  } else {
    return mxs;
  }
}

function isSome(m) {
  return m !== undefined;
}

function isNone(m) {
  return m === undefined;
}

function fromSome(x) {
  if (x !== undefined) {
    return Caml_option.valFromOption(x);
  } else {
    return Pervasives.invalid_arg("Cannot unwrap None.");
  }
}

function fromOption(def, mx) {
  if (mx !== undefined) {
    return Caml_option.valFromOption(mx);
  } else {
    return def;
  }
}

function option(def, f, mx) {
  if (mx !== undefined) {
    return Curry._1(f, Caml_option.valFromOption(mx));
  } else {
    return def;
  }
}

function listToOption(xs) {
  if (xs) {
    return Caml_option.some(xs.hd);
  }
  
}

function catOptions(xs) {
  return List.fold_right((function (param) {
                return option(Ley_Function$OptolithClient.id, (function (x, xs) {
                              return {
                                      hd: x,
                                      tl: xs
                                    };
                            }), param);
              }), xs, /* [] */0);
}

function mapOption(f, xs) {
  return List.fold_right((function (param) {
                return Ley_Function$OptolithClient.$less$neg((function (param) {
                              return option(Ley_Function$OptolithClient.id, (function (x, xs) {
                                            return {
                                                    hd: x,
                                                    tl: xs
                                                  };
                                          }), param);
                            }), f, param);
              }), xs, /* [] */0);
}

function ensure(pred, x) {
  if (Curry._1(pred, x)) {
    return Caml_option.some(x);
  }
  
}

function imapOptionAux(f, _index, _xs) {
  while(true) {
    var xs = _xs;
    var index = _index;
    if (!xs) {
      return /* [] */0;
    }
    var xs$1 = xs.tl;
    var y = Curry._2(f, index, xs.hd);
    if (y !== undefined) {
      return {
              hd: Caml_option.valFromOption(y),
              tl: imapOptionAux(f, index + 1 | 0, xs$1)
            };
    }
    _xs = xs$1;
    _index = index + 1 | 0;
    continue ;
  };
}

function imapOption(f, xs) {
  return imapOptionAux(f, 0, xs);
}

function liftDef(f, x) {
  var y = Curry._1(f, x);
  if (y !== undefined) {
    return Caml_option.valFromOption(y);
  } else {
    return x;
  }
}

var include$5 = Ley_Functor$OptolithClient.MakeInfix({
      fmap: fmap$1
    });

var $less$$great = include$5.$less$$great;

function pure$2(x) {
  return Caml_option.some(x);
}

function ap$1(mf, mx) {
  if (mf !== undefined) {
    return Curry._2($less$$great, mf, mx);
  }
  
}

var include$6 = Ley_Applicative$OptolithClient.MakeInfix({
      fmap: $less$$great,
      pure: pure$2,
      ap: ap$1
    });

function alt$1(mx, my) {
  if (mx !== undefined) {
    return mx;
  } else {
    return my;
  }
}

var include$7 = Ley_Applicative$OptolithClient.Alternative.MakeInfix({
      empty: undefined,
      alt: alt$1
    });

function bind$1(f, mx) {
  if (mx !== undefined) {
    return Curry._1(f, Caml_option.valFromOption(mx));
  }
  
}

var include$8 = Ley_Monad$OptolithClient.MakeInfix({
      pure: pure$1,
      fmap: fmap$1,
      bind: bind$1
    });

var Infix_$less$amp$great = include$5.$less$amp$great;

var Infix_$less$dollar = include$5.$less$;

var Infix_$$great = include$5.$$great;

var Infix_$less$star$great = include$6.$less$star$great;

var Infix_$less$star$star$great = include$6.$less$star$star$great;

var Infix_$less$pipe$great = include$7.$less$pipe$great;

var Infix_$great$great$eq = include$8.$great$great$eq;

var Infix_$eq$less$less = include$8.$eq$less$less;

var Infix_$great$eq$great = include$8.$great$eq$great;

var Infix_$less$eq$less = include$8.$less$eq$less;

var Infix = {
  $less$$great: $less$$great,
  $less$amp$great: Infix_$less$amp$great,
  $less$: Infix_$less$dollar,
  $$great: Infix_$$great,
  $less$star$great: Infix_$less$star$great,
  $less$star$star$great: Infix_$less$star$star$great,
  $less$pipe$great: Infix_$less$pipe$great,
  $great$great$eq: Infix_$great$great$eq,
  $eq$less$less: Infix_$eq$less$less,
  $great$eq$great: Infix_$great$eq$great,
  $less$eq$less: Infix_$less$eq$less
};

var liftA2 = include$1.liftA2;

var empty = include$2.empty;

var $$return = include$3.$$return;

var join = include$3.join;

var liftM2 = include$3.liftM2;

var liftM3 = include$3.liftM3;

var liftM4 = include$3.liftM4;

var liftM5 = include$3.liftM5;

var foldr$1 = include$4.foldr;

var foldl$1 = include$4.foldl;

var $$null = include$4.$$null;

var length = include$4.length;

var elem = include$4.elem;

var sum = include$4.sum;

var maximum = include$4.maximum;

var minimum = include$4.minimum;

var concat = include$4.concat;

var concatMap = include$4.concatMap;

var any = include$4.any;

var all = include$4.all;

var notElem = include$4.notElem;

var find = include$4.find;

var optionToList = toList;

export {
  fmap$1 as fmap,
  pure$1 as pure,
  liftA2 ,
  empty ,
  $$return ,
  join ,
  liftM2 ,
  liftM3 ,
  liftM4 ,
  liftM5 ,
  foldr$1 as foldr,
  foldl$1 as foldl,
  toList ,
  $$null ,
  length ,
  elem ,
  sum ,
  maximum ,
  minimum ,
  concat ,
  concatMap ,
  any ,
  all ,
  notElem ,
  find ,
  sappend ,
  isSome ,
  isNone ,
  fromSome ,
  fromOption ,
  option ,
  listToOption ,
  optionToList ,
  catOptions ,
  mapOption ,
  ensure ,
  imapOption ,
  liftDef ,
  Infix ,
  
}
/* include Not a pure module */
