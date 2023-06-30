import { createAction } from "@reduxjs/toolkit"
import { OptionalRuleIdentifier } from "../../shared/domain/identifier.ts"
import { createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"

export const switchIncludeAllPublications = createAction("rules/switchIncludeAllPublications")
export const switchIncludePublication = createAction<number>("rules/switchIncludePublication")
export const switchFocusRule = createAction<number>("rules/switchFocusRule")
export const switchOptionalRule = createAction<number>("rules/switchOptionalRule")
export const changeOptionalRuleOption = createAction<{ id: number; option: number }>("rules/changeOptionalRuleOption")

export const rulesReducer =
  createImmerReducer<CharacterState>((state, action) => {
    if (switchIncludeAllPublications.match(action)) {
      state.rules.includeAllPublications = !state.rules.includeAllPublications
    }
    else if (switchIncludePublication.match(action)) {
      const index = state.rules.includePublications.indexOf(action.payload)
      if (index === -1) {
        state.rules.includePublications.push(action.payload)
      }
      else {
        state.rules.includePublications.splice(index, 1)
      }
    }
    else if (switchFocusRule.match(action)) {
      if (Object.hasOwn(state.rules.activeFocusRules, action.payload)) {
        delete state.rules.activeFocusRules[action.payload]
      }
      else {
        state.rules.activeFocusRules[action.payload] = {
          id: action.payload,
        }
      }
    }
    else if (switchOptionalRule.match(action)) {
      if (Object.hasOwn(state.rules.activeOptionalRules, action.payload)) {
        delete state.rules.activeOptionalRules[action.payload]
      }
      else if (action.payload === OptionalRuleIdentifier.HigherDefenseStats) {
        state.rules.activeOptionalRules[action.payload] = {
          id: action.payload,
          options: [ 2 ],
        }
      }
      else {
        state.rules.activeOptionalRules[action.payload] = {
          id: action.payload,
        }
      }
    }
    else if (changeOptionalRuleOption.match(action)) {
      if (Object.hasOwn(state.rules.activeOptionalRules, action.payload.id)) {
        (state.rules.activeOptionalRules[action.payload.id]!.options ??= [])[0] =
          action.payload.option
      }
    }
  })
