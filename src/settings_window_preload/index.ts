import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron"
import EventEmitter from "events"
import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"
import {
  GlobalSettingsEmittingAPI,
  GlobalSettingsEvents,
  getGlobalSettingsEmittingAPI,
} from "../shared/settings/emittingRendererPreload.ts"
import { TypedEventEmitter } from "../shared/utils/events.ts"

type Events = GlobalSettingsEvents & {
  "initial-setup": [InitialSetupEventMessage]
  blur: []
  focus: []
}

/**
 * The API that is exposed to the settings window.
 */
export type PreloadAPI = {
  platform: NodeJS.Platform
  initialSetupDone: () => void
  checkForUpdate: () => void
  close: () => void
  setTitle: (title: string) => void
} & TypedEventEmitter<Events> &
  GlobalSettingsEmittingAPI

const events = new EventEmitter() as TypedEventEmitter<Events>

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  initialSetupDone: () => ipcRenderer.send("initial-setup-done"),
  checkForUpdate: () => ipcRenderer.send("check-for-update"),
  close: () => ipcRenderer.send("settings-window-close"),
  setTitle: title => ipcRenderer.send("settings-window-set-title", title),
  ...getGlobalSettingsEmittingAPI(events),
}

contextBridge.exposeInMainWorld("optolith", api)

/**
 * Attach a listener to the main process that updates the global settings when a
 * setting is changed from the settings window.
 */
export type InitialSetupEventMessage = {
  translations: Record<string, UI>
  locales: Record<string, Locale>
  systemLocale: string
  settings: GlobalSettings
}

ipcRenderer
  .on("initial-setup", (_event: IpcRendererEvent, message: InitialSetupEventMessage) => {
    events.emit("initial-setup", message)
  })
  .on("blur", () => events.emit("blur"))
  .on("focus", () => events.emit("focus"))
