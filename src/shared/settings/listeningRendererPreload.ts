import { IpcRenderer, IpcRendererEvent } from "electron"
import { TypedEventEmitterForEvent } from "../utils/events.ts"
import { GlobalSettings } from "./GlobalSettings.ts"

export type GlobalSettingsEvents =
  TypedEventEmitterForEvent<"global-setting-changed", [{
    [K in keyof GlobalSettings]: [key: K, newValue: GlobalSettings[K]]
  }[keyof GlobalSettings]]>

export const attachGlobalSettingsEvents = (
  ipcRenderer: IpcRenderer,
  preloadEvents: GlobalSettingsEvents,
) =>
  ipcRenderer.on("global-setting-changed", (_event: IpcRendererEvent, key, value) => {
    preloadEvents.emit("global-setting-changed", [ key, value ])
  })
