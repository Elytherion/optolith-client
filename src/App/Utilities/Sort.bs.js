// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Intl$OptolithClient = require("./Intl.bs.js");
var ListH$OptolithClient = require("../../Data/ListH.bs.js");
var Function$OptolithClient = require("../../Data/Function.bs.js");

function sortByMulti(sortOptions, xs) {
  if (ListH$OptolithClient.Foldable.length(xs) < 2 || ListH$OptolithClient.Foldable.$$null(sortOptions)) {
    return xs;
  } else {
    var sortFunctions = ListH$OptolithClient.map((function (x) {
            if (x.reverse) {
              var partial_arg = x.compare;
              return (function (param, param$1) {
                  return Function$OptolithClient.flip(partial_arg, param, param$1);
                });
            } else {
              return x.compare;
            }
          }), sortOptions);
    return ListH$OptolithClient.sortBy((function (param, param$1) {
                    var _sortFunctions = sortFunctions;
                    var a = param;
                    var b = param$1;
                    while(true) {
                      var sortFunctions$1 = _sortFunctions;
                      if (sortFunctions$1) {
                        var match = Curry._2(sortFunctions$1[0], a, b);
                        if (match !== 1) {
                          return match;
                        } else {
                          _sortFunctions = sortFunctions$1[1];
                          continue ;
                        }
                      } else {
                        return /* EQ */1;
                      }
                    };
                  }))(xs);
  }
}

function sortStrings(staticData, xs) {
  var partial_arg = Intl$OptolithClient.Collator.createWithOptions(staticData.messages.id, {
        numeric: true
      });
  return ListH$OptolithClient.sortBy((function (param, param$1) {
                  return Intl$OptolithClient.Collator.compare(partial_arg, param, param$1);
                }))(xs);
}

exports.sortByMulti = sortByMulti;
exports.sortStrings = sortStrings;
/* No side effect */
