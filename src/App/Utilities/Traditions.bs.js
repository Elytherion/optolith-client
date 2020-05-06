// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var ListH$OptolithClient = require("../../Data/ListH.bs.js");
var Maybe$OptolithClient = require("../../Data/Maybe.bs.js");
var IntMap$OptolithClient = require("../../Data/IntMap.bs.js");
var Activatable$OptolithClient = require("./Activatable.bs.js");

function isActiveTradition(staticData, x) {
  if (Curry._2(IntMap$OptolithClient.member, x.id, staticData.magicalTraditions)) {
    return Activatable$OptolithClient.isActive(x);
  } else {
    return false;
  }
}

function getHeroEntries(staticData, mp) {
  return ListH$OptolithClient.filter((function (param) {
                return isActiveTradition(staticData, param);
              }), Curry._1(IntMap$OptolithClient.elems, mp));
}

function getStaticEntries(staticData, mp) {
  return Maybe$OptolithClient.mapMaybe((function (trad) {
                if (isActiveTradition(staticData, trad)) {
                  return Curry._2(IntMap$OptolithClient.lookup, trad.id, staticData.specialAbilities);
                } else {
                  return /* Nothing */0;
                }
              }), Curry._1(IntMap$OptolithClient.elems, mp));
}

function getEntries(staticData, mp) {
  return Maybe$OptolithClient.mapMaybe((function (trad) {
                if (isActiveTradition(staticData, trad)) {
                  return Maybe$OptolithClient.Monad.liftM2((function (staticEntry, traditionEntry) {
                                return /* tuple */[
                                        staticEntry,
                                        trad,
                                        traditionEntry
                                      ];
                              }), Curry._2(IntMap$OptolithClient.lookup, trad.id, staticData.specialAbilities), Curry._2(IntMap$OptolithClient.lookup, trad.id, staticData.magicalTraditions));
                } else {
                  return /* Nothing */0;
                }
              }), Curry._1(IntMap$OptolithClient.elems, mp));
}

function idToNumId(staticData, id) {
  return Maybe$OptolithClient.Functor.$less$amp$great(Curry._2(IntMap$OptolithClient.lookup, id, staticData.magicalTraditions), (function (x) {
                return x.numId;
              }));
}

function numIdToId(staticData, id) {
  return Maybe$OptolithClient.Functor.$less$amp$great(Curry._2(IntMap$OptolithClient.Foldable.find, (function (trad) {
                    return trad.numId === id;
                  }), staticData.magicalTraditions), (function (x) {
                return x.id;
              }));
}

var Magical = {
  getHeroEntries: getHeroEntries,
  getStaticEntries: getStaticEntries,
  getEntries: getEntries,
  idToNumId: idToNumId,
  numIdToId: numIdToId
};

function getHeroEntry(staticData, mp) {
  return Curry._2(IntMap$OptolithClient.Foldable.find, (function (param) {
                var staticData$1 = staticData;
                var x = param;
                if (Curry._2(IntMap$OptolithClient.member, x.id, staticData$1.blessedTraditions)) {
                  return Activatable$OptolithClient.isActive(x);
                } else {
                  return false;
                }
              }), mp);
}

function getStaticEntry(staticData, mp) {
  return Maybe$OptolithClient.Monad.$great$great$eq(getHeroEntry(staticData, mp), (function (trad) {
                return Curry._2(IntMap$OptolithClient.lookup, trad.id, staticData.specialAbilities);
              }));
}

function getEntry(staticData, mp) {
  return Maybe$OptolithClient.Monad.$great$great$eq(getHeroEntry(staticData, mp), (function (trad) {
                return Maybe$OptolithClient.Monad.liftM2((function (staticEntry, traditionEntry) {
                              return /* tuple */[
                                      staticEntry,
                                      trad,
                                      traditionEntry
                                    ];
                            }), Curry._2(IntMap$OptolithClient.lookup, trad.id, staticData.specialAbilities), Curry._2(IntMap$OptolithClient.lookup, trad.id, staticData.magicalTraditions));
              }));
}

function idToNumId$1(staticData, id) {
  return Maybe$OptolithClient.Functor.$less$amp$great(Curry._2(IntMap$OptolithClient.lookup, id, staticData.blessedTraditions), (function (x) {
                return x.numId;
              }));
}

function numIdToId$1(staticData, id) {
  return Maybe$OptolithClient.Functor.$less$amp$great(Curry._2(IntMap$OptolithClient.Foldable.find, (function (trad) {
                    return trad.numId === id;
                  }), staticData.blessedTraditions), (function (x) {
                return x.id;
              }));
}

var Blessed = {
  getHeroEntry: getHeroEntry,
  getStaticEntry: getStaticEntry,
  getEntry: getEntry,
  idToNumId: idToNumId$1,
  numIdToId: numIdToId$1
};

exports.Magical = Magical;
exports.Blessed = Blessed;
/* IntMap-OptolithClient Not a pure module */
