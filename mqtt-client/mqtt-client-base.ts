/*
 * @Author         : Shang
 * @Date           : 2024-09-19
 * @LastEditors    : Shang
 * @LastEditTime   : 2024-09-23
 * @Description    :
 */
/*
 * @Author: xiongman
 * @Date: 2024-02-23 14:21:44
 * @LastEditors: xiongman
 * @LastEditTime: 2024-02-23 14:21:44
 * @Description: 封装的mqtt客户端工具类
 */

import type { IClientOptions, MqttClient } from "mqtt"

import { specialTopic } from "./methods"

export default class MqttClientBase {
  constructor(options: IMqttClient) {
    const { brokerUrl, username, password, clientId, mqttPath } = options
    this.brokerUrl = brokerUrl
    this.username = username
    this.password = password
    this.clientId = clientId
    this.path = mqttPath

    this.initBase()
  }

  private RECONNECT_COUNT = 0
  private MAX_RCT_COUNT = 100

  private reconnectTimeout: number | null

  client: MqttClient
  readonly brokerUrl: string | undefined
  readonly username: string | undefined
  readonly password: string | undefined
  readonly clientId: string | undefined
  readonly path: string | undefined

  connectOptions: IClientOptions

  private messageHandlerMap = new Map<string, IMqttOptions["callback"]>()

  private topicMap = new Map<string, boolean>()

  private pendingSendList = new Set<IPendingSendList>()

  mainWindowSend: (name: string, ...set: any) => void

  initBase() {
    this.reconnectTimeout = null
    this.topicMap.clear()
    this.pendingSendList.clear()
    this.connectOptions = {
      username: this.username,
      password: this.password,
      clientId: this.clientId,
      path: this.path,
      clean: true, // true: 清除会话, false: 保留会话
      connectTimeout: 2000, // 超时时间
      reconnectPeriod: 4000,
      rejectUnauthorized: true
    }
  }

  initEventListeners() {
    this.client.on("connect", () => {
      console.log(`MQTT client connected (ClientId: ${this.clientId})`)
      this.RECONNECT_COUNT = 0
      clearTimeout(this.reconnectTimeout)
      for (const item of this.pendingSendList) {
        this.sendRequestAndSubscribeResponse(item.options, item.publishInfo)
        this.pendingSendList.delete(item)
      }
    })

    this.client.on("error", (err) => {
      console.error("MQTT client error:", err)
      this.reconnect()
    })

    this.client.on("disconnect", () => {
      console.log(`MQTT client disconnected (ClientId: ${this.clientId})`)
      this.reconnect()
    })

    this.client.on("message", (topic, message) => {
      const theTopic = specialTopic(topic)
      const messageHandler = this.messageHandlerMap.get(theTopic)
      if (!messageHandler) return
      try {
        messageHandler(JSON.parse(message.toString()), theTopic)
      } catch (e) {
        console.log("ws数据解析出错", e)
        messageHandler(null, theTopic)
      }
    })
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
    if (this.client?.connected) return
    this.pendingSendList.add({ options, publishInfo })
    this.splitPendingSendList()
  }

  private removePendingSendList(topic: string) {
    for (const item of this.pendingSendList) {
      if (item.options.topic !== topic) continue
      this.pendingSendList.delete(item)
    }
  }

  // 发送请求并订阅响应主题
  sendRequestAndSubscribeResponse(options: IMqttOptions, publishInfo?: IPublicParam) {
    const { callback, ...subOptions } = options
    this.addPendingSendList(options, publishInfo)
    this.messageHandlerMap.set(subOptions.topic, callback)
    // this.mainWindowSend?.(
    //   "main:serverLog",
    //   JSON.stringify({
    //     type: "sendRequestAndSubscribeResponse",
    //     options,
    //     publishInfo,
    //     connected: this.client.connected,
    //     url: this.brokerUrl,
    //     copt: this.connectOptions,
    //   }),
    // )

    if (this.topicMap.get(subOptions.topic)) {
      this.sendMessage(subOptions.topic, publishInfo)
      return
    }
    this.subscribe(subOptions, publishInfo)
  }

  subscribe(subOptions: Omit<IMqttOptions, "callback">, publishInfo?: IPublicParam) {
    if (!this.client.connected) {
      console.warn(`MQTT client is not connected (ClientId: ${this.clientId}), unable to subscribe to topic.`)
      this.reconnect()
      return
    }
    const { topic } = subOptions
    // granted 参数用于确认服务端是否成功接受了订阅请求以及为每个主题分配的实际服务质量等级。
    this.client.subscribe(topic, { qos: 0 }, (error /* ,granted*/) => {
      if (error) return console.log(`Error subscribing to topic:${topic}, ${error}`)
      console.log(`Success subscribe topic:${topic}`)
      this.topicMap.set(topic, true)
      this.sendMessage(topic, publishInfo)
    })
  }

  sendMessage(topic: string, publishInfo?: IPublicParam) {
    if (!publishInfo?.payload) return
    if (!this.client.connected) {
      console.warn(`MQTT client is not connected (ClientId: ${this.clientId}), unable to send message.`)
      return
    }
    const { publicTopic, payload } = publishInfo
    const params = { destination: topic, payload }
    this.client.publish(publicTopic, JSON.stringify(params), { qos: 0 }, (err) => {
      if (err) return console.log(`Error publishing message:`, { publicTopic, params })
    })
  }

  private removeMessageHandler(topic?: string) {
    if (!topic) {
      return this.messageHandlerMap.clear()
    }
    this.messageHandlerMap.delete(topic)
  }

  private reconnect(timeout = 5000) {
    clearTimeout(this.reconnectTimeout ?? 0)
    if (this.client?.connected || this.RECONNECT_COUNT > this.MAX_RCT_COUNT) return
    this.topicMap.clear()
    console.log(`Attempting to reconnect to MQTT server for client (ClientId: ${this.clientId})...`)
    // @ts-ignore
    this.reconnectTimeout = setTimeout(() => {
      this.RECONNECT_COUNT += 1
      this.client.connect()
    }, timeout)
  }

  unsubscribe(topic?: string) {
    console.log(`Success unsubscribe topic:${topic}`)
    if (!topic) {
      this.topicMap.clear()
      this.removeMessageHandler()
      this.client.unsubscribe(Array.from(this.topicMap.keys()))
      return
    }
    this.topicMap.delete(topic)
    this.messageHandlerMap.delete(topic)
    this.removePendingSendList(topic)
    this.client.unsubscribe(topic)
  }

  disconnect() {
    this.unsubscribe()
    clearTimeout(this.reconnectTimeout)
    this.client.end(false, () => {
      console.log(`MQTT client end (ClientId: ${this.clientId})`)
    })
  }

  mqttConnect(mqtt: any) {
    this.client = mqtt.connect(this.brokerUrl, this.connectOptions)
  }
}
