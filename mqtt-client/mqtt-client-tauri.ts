import { listen } from "@tauri-apps/api/event"
import type { IClientOptions, MqttClient } from "mqtt"

import {
  tauri_mqtt_connect,
  tauri_mqtt_disconnect,
  tauri_mqtt_publish,
  tauri_mqtt_subscribe,
  tauri_mqtt_unsubscribe,
} from "@/utils/tauri-util"
import { createUUID } from "@/utils/util-funs"

import { specialTopic } from "./methods"
export interface ITauriMqttClient {
  username: string
  password?: string
  clientId: string
  protocol: string
  mqttPath: string
  port: number
  host: string
}
export default class MqttClientTauri {
  private static mqttClientInstance: MqttClientTauri | null = null
  private RECONNECT_COUNT = 0
  private MAX_RCT_COUNT = 100

  private reconnectTimeout: number | null = null

  readonly options: ITauriMqttClient | undefined

  private messageHandlerMap = new Map<string, IMqttOptions["callback"]>()

  private topicMap = new Map<string, boolean>()

  private pendingSendList = new Set<IPendingSendList>()

  private topic: string
  private connectionState = false

  public client: MqttClient
  public connectOptions: IClientOptions

  private constructor(options: ITauriMqttClient) {
    this.options = options

    this.topicMap.clear()
    this.pendingSendList.clear()
    this.connectOptions = {
      username: options.username,
      password: options.password,
      clientId: options.clientId,
      path: options.mqttPath,
      port: options.port,
      host: options.host,
      clean: true,
      connectTimeout: 2000,
      reconnectPeriod: 4000,
      rejectUnauthorized: true
    }
    this.listenTauriMqttEvent()
  }

  public static getMqttInstance() {
    if (this.mqttClientInstance) {
      return this.mqttClientInstance
    } else {
      console.log("走到这里");
      
      const CLIENT_ID = createUUID()
      const PROTOCOL = process.env["VITE_MQTT_PROTOCOL"]
      const HOST = process.env["VITE_MQTT_HOST"]
      const PORT = process.env["VITE_MQTT_PORT"]
      const PATH = process.env["VITE_MQTT_PATH"]
      const options = {
        username: "admin-frontend",
        protocol: PROTOCOL,
        mqttPath: PATH,
        clientId: CLIENT_ID,
        port: Number(PORT),
        host: HOST,
        password: "Emqx@zYp_9#.+",
        rejectUnauthorized: true,
      }
      this.mqttClientInstance = new MqttClientTauri(options)
      this.connect(options)
      return this.mqttClientInstance
    }
  }

  public sendRequestAndSubscribeResponse(options: IMqttOptions, publishInfo?: IPublicParam) {
    const { callback, ...subOptions } = options
    this.addPendingSendList(options, publishInfo)
    this.messageHandlerMap.set(subOptions.topic, callback)

    if (this.topicMap.get(subOptions.topic)) {
      this.sendMessage(subOptions.topic, publishInfo)
      return
    }
    this.subscribe(subOptions, publishInfo)
  }

  public unsubscribe(topic: string) {
    this.topicMap.delete(topic)
    this.messageHandlerMap.delete(topic)
    this.removePendingSendList(topic)
    // tauri invoke
    tauri_mqtt_unsubscribe(topic || this.topic).then(() => {
      // this.topicMap.delete(topic)
      // this.messageHandlerMap.delete(topic)
      // this.removePendingSendList(topic)
      console.log(`【tauri】 Success unsubscribe topic:${topic}`)
    })
  }

  public disconnect() {
    clearInterval(this.reconnectTimeout)
    tauri_mqtt_disconnect().then(() => {
      console.log(`【tauri】 MQTT client end (ClientId: ${this.options.clientId})`)
    })
  }

  public on_tauri_connectted() {
    console.log(`【tauri】 MQTT client connected (ClientId: ${this.options.clientId})`)
    clearInterval(this.reconnectTimeout)
    this.connectionState = true
    this.reconnectTimeout = 0
    this.RECONNECT_COUNT = 0
    for (const item of this.pendingSendList) {
      this.sendRequestAndSubscribeResponse(item.options, item.publishInfo)
      this.pendingSendList.delete(item)
    }
  }

  public on_tauri_error(err) {
    console.warn("【tauri】 MQTT client error:", err)
    this.connectionState = false
    this.reconnect()
  }
  public on_tauri_disconnect() {
    console.log(`【tauri】 MQTT client disconnected (ClientId: ${this.options.clientId})`)
    this.connectionState = false
    this.reconnect()
  }
  public on_tauri_message(topic, message: string) {
    const theTopic = specialTopic(topic)
    const messageHandler = this.messageHandlerMap.get(theTopic)
    if (!messageHandler) return
    try {
      const data = JSON.parse(message)
      console.log("【tauri】 MQTT receive message :", data)
      messageHandler(data, theTopic)
    } catch (e) {
      console.warn("【tauri】 MQTT message parse error:", e)
      messageHandler(null, theTopic)
    }
  }

  private listenTauriMqttEvent() {
    listen<boolean>("tauri_mqtt_connected", (event) => {
      console.log("【tauri】 listen tauri_mqtt_connected:" + event.payload)
      console.log(event, "event");
      debugger;
      if (event.payload === true) {
        this.on_tauri_connectted()
      } else {
        this.connectionState = false
        this.reconnect()
      }
    })
    listen<{ topic: string; data: string }>("tauri_mqtt_message_received", (event) => {
      console.log("【tauri】 listen tauri_mqtt_message_received")
      this.on_tauri_message(event.payload.topic, event.payload.data)
    })
    listen<string>("tauri_mqtt_disconnect", (event) => {
      console.log("【tauri】 listen tauri_mqtt_disconnect:" + event.payload)
      this.on_tauri_disconnect()
    })
  }

  private static connect(options: ITauriMqttClient) {
    tauri_mqtt_connect({
      id: options.clientId,
      host: options.host,
      path: options.mqttPath,
      protocol: options.protocol,
      port: options.port,
      username: options.username,
      password: options.password || "",
    })
  }
  private subscribe(subOptions: Omit<IMqttOptions, "callback">, publishInfo?: IPublicParam) {
    if (!this.connectionState) {
      console.warn(
        `【tauri】 MQTT client is not connected (ClientId: ${this.options.clientId}), unable to subscribe to topic.`,
      )
      this.reconnect()
      return
    }
    const { topic } = subOptions
    // for tauri
    tauri_mqtt_subscribe(topic)
      .then(() => {
        console.log(`【tauri】 Success subscribe topic:${topic}`)
        this.topicMap.set(topic, true)
        this.sendMessage(topic, publishInfo)
      })
      .catch((error) => {
        return console.warn(`【tauri】 Error subscribing to topic:${topic}, ${error}`)
      })
  }

  private sendMessage(topic: string, publishInfo?: IPublicParam) {
    if (!publishInfo?.payload) return
    if (!this.connectionState) {
      console.warn(
        `【tauri】 MQTT client is not connected (ClientId: ${this.options.clientId}), unable to send message.`,
      )
      return
    }
    const { publicTopic, payload } = publishInfo
    const params = { destination: topic, payload }
    tauri_mqtt_publish(publicTopic, params)
      .then(() => {
        console.log(`【tauri】 Success publishing message:`, { publicTopic, params })
      })
      .catch((err) => {
        console.warn(`【tauri】 Error publishing message:`, { publicTopic, params })
      })
  }

  private reconnect(timeout = 5000) {
    if (this.connectionState) {
      clearInterval(this.reconnectTimeout ?? 0)
      return
    }
    if (this.reconnectTimeout > 0) return
    this.topicMap.clear()
    MqttClientTauri.connect(this.options)
    this.RECONNECT_COUNT += 1
    this.reconnectTimeout = setInterval(() => {
      this.topicMap.clear()
      if (this.RECONNECT_COUNT >= this.MAX_RCT_COUNT || this.connectionState) {
        clearInterval(this.reconnectTimeout)
        return
      }
      this.RECONNECT_COUNT += 1
      console.log(
        `【tauri】 ${this.RECONNECT_COUNT} Attempting to reconnect to MQTT server for client (ClientId: ${this.options.clientId})...`,
      )
      MqttClientTauri.connect(this.options)
    }, timeout) as unknown as number
  }

  private splitPendingSendList() {
    if (this.pendingSendList.size <= 50) return
    for (const item of this.pendingSendList) {
      if (!item.publishInfo) continue
      if (this.pendingSendList.size <= 50) return
      this.pendingSendList.delete(item)
    }
  }

  private addPendingSendList(options: IMqttOptions, publishInfo?: IPublicParam) {
    if (this.connectionState) return
    this.pendingSendList.add({ options, publishInfo })
    this.splitPendingSendList()
  }

  private removePendingSendList(topic: string) {
    for (const item of this.pendingSendList) {
      if (item.options.topic !== topic) continue
      this.pendingSendList.delete(item)
    }
  }
}
