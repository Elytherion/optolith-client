import { ipcRenderer, remote } from "electron"
import { connect } from "react-redux"
import { Action } from "redux"
import { Nothing } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as IOActions from "../Actions/IOActions"
import { AppStateRecord } from "../Reducers/appReducer"
import { getCurrentHeroPresent, getCurrentTab, getLoadingPhase, getLocaleMessages } from "../Selectors/stateSelectors"
import { areAnimationsEnabled, getTheme } from "../Selectors/uisettingsSelectors"
import { App, AppDispatchProps, AppOwnProps, AppStateProps } from "../Views/App"

const mapStateToProps = (state: AppStateRecord): AppStateProps => ({
  currentTab: getCurrentTab (state),
  mhero: getCurrentHeroPresent (state),
  l10n: getLocaleMessages (state),
  theme: getTheme (state),
  areAnimationsEnabled: areAnimationsEnabled (state),
  platform: remote.process.platform,
  loading_phase: getLoadingPhase (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch<Action>) => ({
  minimize () {
    remote.getCurrentWindow ().minimize ()
  },
  maximize () {
    remote.getCurrentWindow ().maximize ()
  },
  restore () {
    remote.getCurrentWindow ().unmaximize ()
  },
  close () {
    dispatch (IOActions.requestClose (Nothing))
  },
  closeDuringLoad () {
    remote .getCurrentWindow () .close ()
  },
  enterFullscreen () {
    remote.getCurrentWindow ().setFullScreen (true)
  },
  leaveFullscreen () {
    remote.getCurrentWindow ().setFullScreen (false)
  },
  checkForUpdates () {
    ipcRenderer.send ("check-for-updates")
  },
})

const connectApp = connect<AppStateProps, AppDispatchProps, AppOwnProps, AppStateRecord> (
  mapStateToProps,
  mapDispatchToProps
)

export const AppContainer = connectApp (App)
