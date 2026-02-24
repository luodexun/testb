/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-11 11:08:51
 * @Description:
 */
import { electronAPI } from "@electron-toolkit/preload"
import { contextBridge, ipcRenderer } from "electron"

import { loadingBeforeRender } from "../methods/loading"

loadingBeforeRender()

const renderListenFunMap = new Map<string, (dataStr: string) => void>()

ipcRenderer.on("main:mqtt2Render", (_event, options: string, dataStr: string) => {
  const optionsObj = JSON.parse(options) as Omit<IMqttOptions, "callback">

  if (!optionsObj?.send2MainKey) return

  const callback = renderListenFunMap.get(optionsObj.send2MainKey)
  callback?.(dataStr)
})

ipcRenderer.on("main:serverLog", (_event, dataStr: string) => {
  console.log("main:serverLog:", JSON.parse(dataStr))
})

// Custom APIs for renderer
const api = {
  // mqtt
  send2Mqtt: (options: string, publicInfo?: string): void => {
    ipcRenderer.send("render:rend2Mqtt", options, publicInfo)
  },
  // http
  invoke2Mqtt: (options: string, publicInfo?: string): Promise<string> => {
    return ipcRenderer.invoke("render:invoke2Mqtt", options, publicInfo)
  },
  // mqtt message callback
  addCallback: (send2MainKey: string, callback: (dataStr: string) => void) => {
    renderListenFunMap.set(send2MainKey, callback)
  },
  removeCallback: (send2MainKey: string): boolean => {
    return renderListenFunMap.delete(send2MainKey)
  },
  unsubscribeTopic: (topic: string): Promise<void> => {
    return ipcRenderer.invoke("render:unsubscribeTopic", topic)
  },
  setProcessEnv: (params: IMqttClient) => {
    ipcRenderer.send("render:processEnv", JSON.stringify(params))
  },
  textToSpeak: (text: string) => {
    ipcRenderer.send("execute-command", text)
  },
  toSpeakTest: (text: string) => {
    ipcRenderer.send("execute-command-test", text)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("main2Api", api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.main2Api = api
}
