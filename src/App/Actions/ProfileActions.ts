import { fromJust, fromMaybe, isJust, Just, Maybe, Nothing } from "../../Data/Maybe";
import { ActionTypes } from "../Constants/ActionTypes";
import { isAlbino } from "../Selectors/activatableSelectors";
import { getCurrentRace, getCurrentRaceVariant } from "../Selectors/rcpSelectors";
import { getSize, getWeight } from "../Selectors/stateSelectors";
import * as RCPUtils from "../Utilities/rcpUtils";
import { ReduxAction } from "./Actions";

export interface SetHeroNameAction {
  type: ActionTypes.SET_HERO_NAME
  payload: {
    name: string;
  }
}

export const setHeroName = (name: string): SetHeroNameAction => ({
  type: ActionTypes.SET_HERO_NAME,
  payload: {
    name,
  },
})

export interface SetCustomProfessionNameAction {
  type: ActionTypes.SET_CUSTOM_PROFESSION_NAME
  payload: {
    name: string;
  }
}

export const setCustomProfessionName = (name: string): SetCustomProfessionNameAction => ({
  type: ActionTypes.SET_CUSTOM_PROFESSION_NAME,
  payload: {
    name,
  },
})

export interface SetHeroAvatarAction {
  type: ActionTypes.SET_HERO_AVATAR
  payload: {
    url: string;
  }
}

export const setHeroAvatar = (path: string): SetHeroAvatarAction => ({
  type: ActionTypes.SET_HERO_AVATAR,
  payload: {
    url: path,
  },
})

export interface DeleteHeroAvatarAction {
  type: ActionTypes.DELETE_HERO_AVATAR
}

export const deleteHeroAvatar = (): DeleteHeroAvatarAction => ({
  type: ActionTypes.DELETE_HERO_AVATAR,
})

export interface SetFamilyAction {
  type: ActionTypes.SET_FAMILY
  payload: {
    family: string;
  }
}

export const setFamily = (family: string): SetFamilyAction => ({
  type: ActionTypes.SET_FAMILY,
  payload: {
    family,
  },
})

export interface SetPlaceOfBirthAction {
  type: ActionTypes.SET_PLACEOFBIRTH
  payload: {
    placeofbirth: string;
  }
}

export const setPlaceOfBirth = (placeofbirth: string): SetPlaceOfBirthAction => ({
  type: ActionTypes.SET_PLACEOFBIRTH,
  payload: {
    placeofbirth,
  },
})

export interface SetDateOfBirthAction {
  type: ActionTypes.SET_DATEOFBIRTH
  payload: {
    dateofbirth: string;
  }
}

export const setDateOfBirth = (dateofbirth: string): SetDateOfBirthAction => ({
  type: ActionTypes.SET_DATEOFBIRTH,
  payload: {
    dateofbirth,
  },
})

export interface SetAgeAction {
  type: ActionTypes.SET_AGE
  payload: {
    age: string;
  }
}

export const setAge = (age: string): SetAgeAction => ({
  type: ActionTypes.SET_AGE,
  payload: {
    age,
  },
})

export interface SetHairColorAction {
  type: ActionTypes.SET_HAIRCOLOR
  payload: {
    haircolor: number;
  }
}

export const setHairColor = (haircolor: number): SetHairColorAction => ({
  type: ActionTypes.SET_HAIRCOLOR,
  payload: {
    haircolor,
  },
})

export interface SetEyeColorAction {
  type: ActionTypes.SET_EYECOLOR
  payload: {
    eyecolor: number;
  }
}

export const setEyeColor = (eyecolor: number): SetEyeColorAction => ({
  type: ActionTypes.SET_EYECOLOR,
  payload: {
    eyecolor,
  },
})

export interface SetSizeAction {
  type: ActionTypes.SET_SIZE
  payload: {
    size: string;
    weight: Maybe<string>;
  }
}

export const setSize = (size: string) => (weight: Maybe<string>): SetSizeAction => ({
  type: ActionTypes.SET_SIZE,
  payload: {
    size,
    weight,
  },
})

export interface SetWeightAction {
  type: ActionTypes.SET_WEIGHT
  payload: {
    size: Maybe<string>;
    weight: string;
  }
}

export const setWeight = (weight: string) => (size: Maybe<string>): SetWeightAction => ({
  type: ActionTypes.SET_WEIGHT,
  payload: {
    size,
    weight,
  },
})

export const rerollHairColor: ReduxAction =
  (dispatch, getState) => {
    const state = getState ()
    const race = getCurrentRace (state)
    const raceVariant = getCurrentRaceVariant (state)

    const mhair_color = RCPUtils.rerollHairColor (race) (raceVariant)

    if (isJust (mhair_color)) {
      dispatch (setHairColor (fromJust (mhair_color)))
    }
  }

export const rerollEyeColor: ReduxAction = (dispatch, getState) => {
  const state = getState ()
  const race = getCurrentRace (state)
  const raceVariant = getCurrentRaceVariant (state)
  const isAlbinoVar = fromMaybe (false) (isAlbino (state))

  const meye_color = RCPUtils.rerollEyeColor (isAlbinoVar) (race) (raceVariant)

  if (isJust (meye_color)) {
    dispatch (setEyeColor (fromJust (meye_color)))
  }
}

export const rerollSize: ReduxAction =
  (dispatch, getState) => {
    const state = getState ()
    const race = getCurrentRace (state)
    const raceVariant = getCurrentRaceVariant (state)

    const mprev_size = getSize (state)
    const mweight = getWeight (state)
    const mnew_size = RCPUtils.rerollSize (race) (raceVariant)

    if (isJust (mnew_size)) {
      if (isJust (mprev_size) && isJust (mweight)) {
        const new_weight = RCPUtils.getWeightForRerolledSize (fromJust (mweight))
                                                             (fromJust (mprev_size))
                                                             (fromJust (mnew_size))

        dispatch (setSize (fromJust (mnew_size)) (Just (new_weight)))
      }
      else {
        dispatch (setSize (fromJust (mnew_size)) (Nothing))
      }
    }
  }

export const rerollWeight: ReduxAction =
  (dispatch, getState) => {
    const state = getState ()
    const race = getCurrentRace (state)
    const raceVariant = getCurrentRaceVariant (state)
    const prevSize = getSize (state)

    if(isJust (prevSize) && prevSize.value !== "") {
      const { weight, size } = RCPUtils.rerollWeight (prevSize) (race)

      if (isJust (weight)) {
        dispatch (setWeight (fromJust (weight)) (size))
      }
    }
    else {
      const mnew_size = RCPUtils.rerollSize (race) (raceVariant)
      if (isJust(mnew_size)) {
        dispatch (setSize (fromJust (mnew_size)) (Nothing))
        const { weight, size } = RCPUtils.rerollWeight (mnew_size) (race)

        if (isJust (weight)) {
          dispatch (setWeight (fromJust (weight)) (size))
        }
      }
    }
  }

export interface SetTitleAction {
  type: ActionTypes.SET_TITLE
  payload: {
    title: string;
  }
}

export const setTitle = (title: string): SetTitleAction => ({
  type: ActionTypes.SET_TITLE,
  payload: {
    title,
  },
})

export interface SetSocialStatusAction {
  type: ActionTypes.SET_SOCIALSTATUS
  payload: {
    socialstatus: number;
  }
}

export const setSocialStatus = (socialstatus: number): SetSocialStatusAction => ({
  type: ActionTypes.SET_SOCIALSTATUS,
  payload: {
    socialstatus,
  },
})

export interface SetCharacteristicsAction {
  type: ActionTypes.SET_CHARACTERISTICS
  payload: {
    characteristics: string;
  }
}

export const setCharacteristics = (characteristics: string): SetCharacteristicsAction => ({
  type: ActionTypes.SET_CHARACTERISTICS,
  payload: {
    characteristics,
  },
})

export interface SetOtherInfoAction {
  type: ActionTypes.SET_OTHERINFO
  payload: {
    otherinfo: string;
  }
}

export const setOtherInfo = (otherinfo: string): SetOtherInfoAction => ({
  type: ActionTypes.SET_OTHERINFO,
  payload: {
    otherinfo,
  },
})

export interface SetCultureAreaKnowledge {
  type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE
  payload: {
    cultureAreaKnowledge: string;
  }
}

export const setCultureAreaKnowledge = (cultureAreaKnowledge: string): SetCultureAreaKnowledge => ({
  type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE,
  payload: {
    cultureAreaKnowledge,
  },
})

export interface EndHeroCreationAction {
  type: ActionTypes.END_HERO_CREATION
}

export const endHeroCreation = (): EndHeroCreationAction => ({
  type: ActionTypes.END_HERO_CREATION,
})

export interface AddAdventurePointsAction {
  type: ActionTypes.ADD_ADVENTURE_POINTS
  payload: {
    amount: number;
  }
}

export const addAdventurePoints = (amount: number): AddAdventurePointsAction => ({
  type: ActionTypes.ADD_ADVENTURE_POINTS,
  payload: {
    amount,
  },
})

export interface SetHeroLocaleAction {
  type: ActionTypes.SET_HERO_LOCALE
  payload: {
    locale: string;
  }
}

export const setHeroLocale = (locale: string): SetHeroLocaleAction => ({
  type: ActionTypes.SET_HERO_LOCALE,
  payload: {
    locale,
  },
})
