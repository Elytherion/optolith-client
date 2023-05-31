import { BrowserWindow, app, shell } from "electron"
import windowStateKeeper from "electron-window-state"
import * as path from "node:path"
import * as url from "node:url"
import type { Database } from "../database.ts"

export const createMainWindow = async () => {
  console.log("main: Create Window ...")

  console.log("main (window): Initialize window state keeper")
  const mainWindowState = windowStateKeeper({
    defaultHeight: 720,
    defaultWidth: 1280,
    file: "window.json",
  })

  console.log("main (window): Initialize browser window")
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    height: mainWindowState.height,
    width: mainWindowState.width,
    minHeight: 720,
    minWidth: 1280,
    resizable: true,
    icon: path.join(app.getAppPath(), "app", "icon.png"),
    frame: false,
    center: true,
    title: "Optolith",
    acceptFirstMouse: true,
    backgroundColor: "#111111",
    webPreferences: {
      preload: path.join(__dirname, "renderer_main_preload.js"),
    },
    show: false,
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
      .catch(console.error)
    return { action: "deny" }
  })

  console.log("main (window): Manage browser window with state keeper")
  mainWindowState.manage(mainWindow)

  console.log("main (window): Load url")
  await mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "renderer_main.html"),
    protocol: "file:",
    slashes: true,
  }))

  mainWindow.webContents.openDevTools()

  if (mainWindowState.isMaximized) {
    console.log("main (window): Maximize window ...")
    mainWindow.maximize()
  }

  return mainWindow
}

export const showMainWindow = (mainWindow: BrowserWindow, database: Database) => {
  mainWindow.webContents.send("database-available", database)
  console.log("main (window): Show window once database is available")
  mainWindow.show()
}
