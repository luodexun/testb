/*
 * @Author: xiongman
 * @Date: 2023-09-20 14:27:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-17 16:25:08
 * @Description: mqtt 客户端工具方法
 */

import mqtt from "mqtt"

import MqttClientTauri from "../../mqtt-client/mqtt-client-tauri"
import MqttStaticUtil from "../../mqtt-client/mqtt-static-util"
import { createUUID } from "./util-funs"

const isElectronENV = process.env["VITE_CS"]
const isTauriENV = process.env["VITE_TAURI"]
const isBrowserENV = process.env["VITE_BROWSER"]
const needNamePw = `${process.env.VITE_MQTT_NEED_USER_PW}` === "1"
// 固定的 mqtt 客户端号
const CLIENT_ID = createUUID()

;(function () {
  const PROTOCOL = process.env["VITE_MQTT_PROTOCOL"]
  const HOST = process.env["VITE_MQTT_HOST"]
  const PORT = process.env["VITE_MQTT_PORT"]
  const mqttPath = process.env["VITE_MQTT_PATH"]
  const brokerUrl = `${PROTOCOL}://${HOST}:${PORT}`
  const accountInfo = needNamePw ? { username: "admin-frontend", password: "Emqx@zYp_9#.+" } : {}
  if (isElectronENV) {
    return window.main2Api.setProcessEnv({ brokerUrl, mqttPath, ...accountInfo, clientId: CLIENT_ID })
  }
  if (isBrowserENV) {
    MqttStaticUtil.init(mqtt, { brokerUrl, ...accountInfo, mqttPath, clientId: CLIENT_ID })
  }
})()

export default class CustomMqtt {
  constructor() {
    if (isElectronENV) {
      this.send2MainKey = createUUID()
    }
    if (isTauriENV) {
      this.mqttTauriClient = MqttClientTauri.getMqttInstance()
    }
  }

  private mqttTauriClient: MqttClientTauri | null = null
  private readonly send2MainKey: string
  private topic: string

  connect(options: IMqttOptions, publicInfo?: IPublicParam) {
    this.topic = options.topic
    if (isElectronENV) {
      return this.__connect4Electron(options, publicInfo)
    }
    if (isBrowserENV) {
      MqttStaticUtil.mq?.sendRequestAndSubscribeResponse(options, publicInfo)
    }
    if (isTauriENV) {
      this.mqttTauriClient.sendRequestAndSubscribeResponse(options, publicInfo)
    }
  }

  unsubscribe(topic?) {
    if (isElectronENV) {
      return this.__unsubscribe4Electron(topic)
    }
    if (isBrowserENV) {
      MqttStaticUtil.mq?.unsubscribe(topic || this.topic)
    }

    if (isTauriENV) {
      this.mqttTauriClient.unsubscribe(topic || this.topic)
    }
  }

  private __connect4Electron(options: IMqttOptions, publicInfo?: IPublicParam) {
    const { callback, ...otherOptions } = options
    const mqttOptions: Omit<IMqttOptions, "callback"> = otherOptions

    mqttOptions.send2MainKey = this.send2MainKey

    if (options.unsubscribe) {
      // http subscribe and receive response
      window.main2Api.invoke2Mqtt(JSON.stringify(mqttOptions), JSON.stringify(publicInfo)).then((dataStr) => {
        dealMqttResponse(dataStr, callback)
      })
      return
    }
    // mqtt message callback
    window.main2Api.addCallback(mqttOptions.send2MainKey, (dataStr: string) => {
      dealMqttResponse(dataStr, callback)
    })

    // mqtt subscribe
    window.main2Api.send2Mqtt(JSON.stringify(mqttOptions), JSON.stringify(publicInfo))
  }

  private __unsubscribe4Electron(topic) {
    window.main2Api.removeCallback(this.send2MainKey)
    window.main2Api.unsubscribeTopic(topic || this.topic)
  }

  // unused
  static disconnect() {
    if (isBrowserENV) {
      MqttStaticUtil.mq?.disconnect()
    }
    if (isTauriENV) {
      MqttClientTauri.getMqttInstance().disconnect()
    }
  }
}

function dealMqttResponse(dataStr: string, callback: (data: unknown) => void) {
  const response = JSON.parse(dataStr) as IMqttResponse
  if (!response.success) {
    return callback?.(null)
  }
  callback?.(response.data || null)
}
