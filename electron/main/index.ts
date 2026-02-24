import { exec, spawn } from "node:child_process"
import { join, normalize } from "node:path"

import { electronApp, is, optimizer } from "@electron-toolkit/utils"
import { app, BrowserWindow, ipcMain, session, shell } from "electron"

import {
  dealInvokeMqtt,
  dealSendMqtt,
  disconnectMqtt,
  setEnvParams,
  unsubscribeTopic,
} from "../methods/render-send-2mqtt"
// setMaxListeners(100)

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"

process.env.DIST = join(__dirname, "../renderer")
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, "/")
const APP_PATH = normalize(app.getAppPath())
// 盘符
const APP_DRIVE = (function () {
  if (process.platform === "win32") {
    return APP_PATH.substring(0, 2) // 获取盘符
  }
  return null
})()

const FILE_PREFIX = APP_DRIVE ? "file:///" : "file://"
const URL_PARAM_REG = /[?|#].*$/

let mainWindow: BrowserWindow | undefined

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    // frame: false,
    icon: join(__dirname, "../../resources/icons/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  })

  mainWindow.on("ready-to-show", () => {
    mainWindow!.maximize()
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }

  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("control.region")

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // http
  ipcMain.handle("render:invoke2Mqtt", (_event, options: string, publicInfo?: string) => {
    return dealInvokeMqtt(options, publicInfo)
  })

  ipcMain.handle("render:unsubscribeTopic", (_event, topic: string) => {
    return unsubscribeTopic(topic)
  })

  // mqtt
  ipcMain.on("render:rend2Mqtt", async (_event, options: string, publicInfo?: string) => {
    dealSendMqtt(options, publicInfo)
  })
  ipcMain.on("render:processEnv", (_event, envParam: string) => {
    setEnvParams(envParam)
  })

  ipcMain.on("execute-command", (_event, text: string) => {
    exec(`killall -9 ekho`, (error) => {
      if (error) {
        console.error(`执行停止的错误: ${error}`)
        return
      }
      console.log("停止成功")
    })
    exec(`ekho "${text}"`, (error) => {
      if (error) {
        console.error(`执行的错误: ${error}`)
        return
      }
      console.log("成功")
    })
  })
  ipcMain.on("execute-command-test", (_event, text) => {
    // 创建ekho进程
    const ekhoProcess = spawn("ekho", [text])
    // 当ekho进程结束时触发
    ekhoProcess.on("close", (code) => {
      console.log(`ekho进程退出，退出码：${code}`)
      if (code === 0) {
        mainWindowSend("main:mqtt2Render", JSON.stringify({ send2MainKey: "alarmVioce" }))
        console.log("ekho读取完成")
      } else {
        console.log("ekho读取可能出现了问题")
      }
    })
  })

  session.defaultSession.protocol.interceptFileProtocol("file", (request, callback) => {
    const theUrl = decodeURIComponent(request.url)
    const requestedFile = theUrl.replace(FILE_PREFIX, "").replace(URL_PARAM_REG, "")
    const requestPath = normalize(requestedFile)

    if (requestPath.startsWith(APP_PATH)) {
      return callback({ path: requestedFile })
    }

    const fileDir = APP_DRIVE ? requestPath.replace(APP_DRIVE, "") : requestPath
    const filePath = join(process.env.VITE_PUBLIC, fileDir)

    callback({ path: normalize(filePath) })
  })

  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    disconnectMqtt()
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
export function mainWindowSend(name: string, ...set) {
  if (!mainWindow) return
  mainWindow.webContents.send(name, ...set)
}
