/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-11 11:04:31
 * @Description:
 */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// 联合文件顶部 <reference types="vite-plugin-svgr/client" />
// 以解决 Module '"*.svg"' has no exported member 'ReactComponent'.
// Did you mean to use 'import ReactComponent from "*.svg"' instead?
declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module "draggable" {
  import * as draggable from "draggable"

  class Draggable extends draggable {
    constructor(dom: Element)
  }
  export default Draggable
}

import { ElectronAPI } from "@electron-toolkit/preload"

declare global {
  interface Window {
    electron: ElectronAPI
    main2Api: {
      send2Mqtt: (options: string, publicInfo: string) => void
      invoke2Mqtt: (options: string, publicInfo: string) => Promise<string>
      addCallback: (key: string, callback: (data: string) => void) => void
      removeCallback: (key: string) => boolean
      unsubscribeTopic: (topic: string) => Promise<void>
      setProcessEnv: (envParam: IMqttClient) => void
      textToSpeak: (text: string) => void
      toSpeakTest: (text: string) => void
    }
  }
}
