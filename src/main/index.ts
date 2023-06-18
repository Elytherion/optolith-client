import Debug from "debug"
import { Menu, MenuItemConstructorOptions, app, ipcMain, utilityProcess } from "electron"
import { autoUpdater } from "electron-updater"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Database } from "../database/index.ts"
import { getGlobalSettings } from "../shared/settings/main.ts"
import { createTranslate } from "../shared/utils/translate.ts"
import { createMainWindow, showMainWindow } from "./mainWindow.ts"
import { ensureUserDataPathExists } from "./saveData.ts"
import { createSettingsWindow } from "./settingsWindow.ts"
import { checkForUpdatesOnRequest, checkForUpdatesOnStartup } from "./updater.ts"
const debug = Debug("main")

app.setAppUserModelId("lukasobermann.optolith")
const isMac = process.platform === "darwin"

debug("loading database ...")
const databaseProcess = utilityProcess.fork(join(__dirname, "./database.js"))
const databaseLoading = new Promise<Database>(resolve => {
  databaseProcess.on("message", (message: Database) => {
    debug("database received")
    resolve(message)
  })
})

const runAsync = (fn: () => Promise<void>) => () => {
  fn().catch(err => debug("unexpected error: %O", err))
}

const setMenu = (database: Database) => {
  const translate = createTranslate(
    Object.fromEntries(database.ui),
    Object.fromEntries(database.locales),
    getGlobalSettings().locale,
    app.getLocale()
  )

  const template: MenuItemConstructorOptions[] = [
    // { role: "appMenu" }
    ...(isMac
      ? [ {
          label: app.name,
          submenu: [
            {
              role: "about",
              label: translate("About {0}", app.name),
            },
            { type: "separator" },
            {
              label: translate("Preferences …"),
              accelerator: "Command+,",
              click: runAsync(async () => {
                await createSettingsWindow(database, () => setMenu(database))
              }),
            },
            { type: "separator" },
            {
              role: "services",
              label: translate("Services"),
            },
            { type: "separator" },
            {
              role: "hide",
              label: translate("Hide {0}", app.name),
            },
            {
              role: "hideOthers",
              label: translate("Hide Others"),
            },
            {
              role: "unhide",
              label: translate("Show All"),
            },
            { type: "separator" },
            {
              role: "quit",
              label: translate("Quit {0}", app.name),
            },
          ],
        } as MenuItemConstructorOptions ]
      : []),
    // { role: "fileMenu" }
    {
      label: translate("File"),
      submenu: [
        isMac
          ? {
            role: "close",
            label: translate("Close"),
          }
          : {
            role: "quit",
            label: translate("Quit"),
          },
      ],
    } as MenuItemConstructorOptions,
    // { role: "editMenu" }
    {
      label: translate("Edit"),
      submenu: [
        {
          role: "undo",
          label: translate("Undo"),
        },
        {
          role: "redo",
          label: translate("Redo"),
        },
        { type: "separator" },
        {
          role: "cut",
          label: translate("Cut"),
        },
        {
          role: "copy",
          label: translate("Copy"),
        },
        {
          role: "paste",
          label: translate("Paste"),
        },
        ...(isMac
          ? [
              {
                role: "delete",
                label: translate("Delete"),
              },
              {
                role: "selectAll",
                label: translate("Select All"),
              },
            ]
          : [
              {
                role: "delete",
                label: translate("Delete"),
              },
              { type: "separator" },
              {
                role: "selectAll",
                label: translate("Select All"),
              },
            ]),
      ],
    } as MenuItemConstructorOptions,
    // { role: "viewMenu" }
    ...(isMac
      ? [ {
        label: translate("View"),
        submenu: [
          { role: "toggleDevTools" },
          {
            role: "togglefullscreen",
            label: translate("Toggle Full Screen"),
          },
        ],
      } as MenuItemConstructorOptions ]
      : []),
    // { role: "windowMenu" }
    {
      label: translate("Window"),
      submenu: [
        {
          role: "minimize",
          label: translate("Minimize"),
        },
        ...(isMac
          ? [
              {
                role: "zoom",
                label: translate("Zoom"),
              },
              { type: "separator" },
              {
                role: "front",
                label: translate("Bring All to Front"),
              },
              // { type: "separator" },
              // {
              //   role: "window" ,
              //   label: translate("Toggle Full Screen"),
              // },
            ]
          : [
              {
                role: "close",
                label: translate("Close"),
              },
            ]),
      ],
    } as MenuItemConstructorOptions,
    // {
    //   role: "help",
    //   label: translate("Close"),
    //   submenu: [
    //     {
    //       label: "Learn More",
    //       click: async () => {
    //         const { shell } = require("electron")
    //         await shell.openExternal("https://electronjs.org")
    //       },
    //     },
    //   ],
    // } as MenuItemConstructorOptions,
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

const setUserDataPath = async () => {
  debug("setting user data path ...")
  app.setPath("userData", await ensureUserDataPathExists())
}

const installExtensions = async () => {
  debug("install extensions ...")

  const installedExtensions: string[] | string | undefined =
    await Promise.resolve(undefined as string[] | string | undefined) /* await installExtension([
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    ]) */

  const installedExtensionsString =
    Array.isArray(installedExtensions)
      ? installedExtensions.join(", ")
      : installedExtensions ?? "none"

  debug("installed extensions: %s", installedExtensionsString)
}

const readFileInAppPath = (...path: string[]) => readFile(join(app.getAppPath(), ...path), "utf-8")

const registerGlobalListeners = () => {
  ipcMain.handle("receive-license", _ => readFileInAppPath("LICENSE"))
  ipcMain.handle("receive-changelog", _ => readFileInAppPath("CHANGELOG.md"))
  ipcMain.handle("receive-version", _ => app.getVersion())
  ipcMain.handle("receive-system-locale", _ => app.getSystemLocale())
  ipcMain.on("show-settings", runAsync(async () => {
    const database = await databaseLoading
    await createSettingsWindow(database, () => setMenu(database))
  }))
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.whenReady().then(async () => {
  autoUpdater.autoDownload = false

  app.on("window-all-closed", () => {
    if (!isMac) {
      app.quit()
    }
  })

  const database = await databaseLoading
  setMenu(database)
  const installUpdateInsteadOfStartup =
    await checkForUpdatesOnStartup(database)

  debug("skip startup because of update?", installUpdateInsteadOfStartup ? "yes" : "no")
  if (!installUpdateInsteadOfStartup) {
    await setUserDataPath()
    await installExtensions()
    registerGlobalListeners()
    showMainWindow(await createMainWindow(), database)

    ipcMain.on("check-for-update", runAsync(async () => {
      await checkForUpdatesOnRequest(database)
    }))
  }
})
