// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from "builder-util-runtime";
import { ipcRenderer, remote } from "electron";
import * as localShortcut from "electron-localshortcut";
// tslint:disable-next-line:no-implicit-dependencies
import { UpdateInfo } from "electron-updater";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Action, applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { backAccelerator, openSettingsAccelerator, quitAccelerator, redoAccelerator, saveHeroAccelerator, undoAccelerator } from "./App/Actions/AcceleratorActions";
import { ReduxDispatch } from "./App/Actions/Actions";
import { addErrorAlert, AlertOptions } from "./App/Actions/AlertActions";
import { requestClose, requestInitialData, setUpdateDownloadProgress, updateAvailable, updateNotAvailable } from "./App/Actions/IOActions";
import { showAbout } from "./App/Actions/LocationActions";
import { AppContainer } from "./App/Containers/AppContainer";
import { appReducer, AppState, AppStateRecord } from "./App/Reducers/appReducer";
import { getLocaleMessages } from "./App/Selectors/stateSelectors";
import { translate, translateP } from "./App/Utilities/I18n";
import { pipe } from "./App/Utilities/pipe";
import { isDialogOpen } from "./App/Utilities/SubwindowsUtils";
import { flip } from "./Data/Function";
import { List } from "./Data/List";
import { fromJust, isJust, Just } from "./Data/Maybe";
import { uncurryN } from "./Data/Tuple/Curry";
import { Unit } from "./Data/Unit";

const nativeAppReducer =
  uncurryN (pipe ((x: AppStateRecord | undefined) => x === undefined ? AppState.default : x,
                  flip (appReducer)))

const store: Store<AppStateRecord, Action> & { dispatch: ReduxDispatch<Action> } =
  createStore (nativeAppReducer, applyMiddleware (thunk))

store
  .dispatch (requestInitialData)
  .then (() => {
    const currentWindow = remote.getCurrentWindow ()

    const { getState, dispatch } = store

    if (remote.process.platform === "darwin") {
      const maybeLocale = getLocaleMessages (getState ())

      if (isJust (maybeLocale)) {
        const locale = fromJust (maybeLocale)

        const menuTemplate: Electron.MenuItemConstructorOptions[] = [
          {
            label: remote.app.getName (),
            submenu: [
              {
                label: translateP (locale) ("aboutapp") (List (remote.app.getName ())),
                click: () => dispatch (showAbout),
              },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              {
                label: translate (locale) ("quit"),
                click: () => dispatch (requestClose (Just (remote.app.quit))),
              },
            ],
          },
          {
            label: translate (locale) ("edit"),
            submenu: [
              { role: "cut" },
              { role: "copy" },
              { role: "paste" },
              { role: "delete" },
              { role: "selectAll" },
            ],
          },
          {
            label: translate (locale) ("view"),
            submenu: [
              { role: "togglefullscreen" },
            ],
          },
          {
            role: "window",
            submenu: [
              { role: "minimize" },
              { type: "separator" },
              { role: "front" },
            ],
          },
        ]

        const menu = remote.Menu.buildFromTemplate (menuTemplate)
        remote.Menu.setApplicationMenu (menu)

        store.subscribe (() => {
          const areSubwindowsOpen = isDialogOpen ()
          type MenuItems = Electron.MenuItemConstructorOptions[]
          const appMenu = menuTemplate[0].submenu as MenuItems
          appMenu[0].enabled = !areSubwindowsOpen
          const currentMenu = remote.Menu.buildFromTemplate (menuTemplate)
          remote.Menu.setApplicationMenu (currentMenu)
        })

        localShortcut.register (currentWindow, "Cmd+Q", () => {
          dispatch (quitAccelerator)
        })

        localShortcut.register (currentWindow, "CmdOrCtrl+S", () => {
          dispatch (saveHeroAccelerator (locale))
        })
      }
    }

    localShortcut.register (currentWindow, "CmdOrCtrl+Z", () => {
      dispatch (undoAccelerator ())
    })

    localShortcut.register (currentWindow, "CmdOrCtrl+Y", () => {
      dispatch (redoAccelerator ())
    })

    localShortcut.register (currentWindow, "CmdOrCtrl+Shift+Z", () => {
      dispatch (redoAccelerator ())
    })

    localShortcut.register (currentWindow, "CmdOrCtrl+W", () => {
      dispatch (backAccelerator ())
    })

    localShortcut.register (currentWindow, "CmdOrCtrl+O", () => {
      dispatch (openSettingsAccelerator ())
    })

    ipcRenderer.send ("loading-done")

    return Unit
  })
  .catch (() => undefined)

render (
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.querySelector ("#bodywrapper")
)

ipcRenderer.addListener ("update-available", (_event: Event, info: UpdateInfo) => {
  const dispatch = store.dispatch as ReduxDispatch
  const maybeLocale = getLocaleMessages (store.getState ())

  if (isJust (maybeLocale)) {
    dispatch (updateAvailable (fromJust (maybeLocale)) (info))
  }
})

ipcRenderer.addListener ("update-not-available", () => {
  const dispatch = store.dispatch as ReduxDispatch
  const maybeLocale = getLocaleMessages (store.getState ())

  if (isJust (maybeLocale)) {
    dispatch (updateNotAvailable (fromJust (maybeLocale)))
  }
})

ipcRenderer.addListener ("download-progress", (_event: Event, progressObj: ProgressInfo) => {
  store.dispatch (setUpdateDownloadProgress (progressObj))
})

ipcRenderer.addListener ("auto-updater-error", (_event: Event, err: Error) => {
  const dispatch = store.dispatch as ReduxDispatch
  const maybeLocale = getLocaleMessages (store.getState ())

  if (isJust (maybeLocale)) {
    dispatch (setUpdateDownloadProgress ())
    dispatch (addErrorAlert (fromJust (maybeLocale))
                            (AlertOptions ({
                              title: Just ("Auto Update Error"),
                              message: `An error occured during auto-update.`
                                + ` (${JSON.stringify (err)})`,
                            })))
      .catch (() => undefined)
  }
})
