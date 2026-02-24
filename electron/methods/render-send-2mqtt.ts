/*
 * @Author: xiongman
 * @Date: 2024-01-15 14:38:51
 * @LastEditors: xiongman
 * @LastEditTime: 2024-01-15 14:38:51
 * @Description: 主进程处理mqtt请求的方法们
 */

import MqttStaticUtil from "../../mqtt-client/mqtt-static-util"
import { mainWindowSend } from "../main"
import { obj2Str } from "./methods"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mqtt = require("mqtt")

export function dealSendMqtt(options: string, publishData?: string) {
  const optionsObj = JSON.parse(options) as IMqttOptions
  const publishDataObj = JSON.parse(publishData ?? "null")
  optionsObj.callback = (data: unknown, topic?: string) => {
    mainWindowSend("main:mqtt2Render", options, dealResponse(data as IMqttData, topic))
    publishData && MqttStaticUtil.mq?.unsubscribe(optionsObj.topic)
  }
  MqttStaticUtil.mq?.sendRequestAndSubscribeResponse(optionsObj, publishDataObj)
}
export function dealInvokeMqtt(options: string, publishData?: string) {
  const optionsObj = JSON.parse(options) as IMqttOptions
  const publishDataObj = JSON.parse(publishData ?? "null")
  return new Promise<string>((resolve) => {
    optionsObj.callback = (data: unknown, topic?: string) => {
      resolve(dealResponse(data as IMqttData, topic))
    }
    MqttStaticUtil.mq?.sendRequestAndSubscribeResponse(optionsObj, publishDataObj)
  })
    .catch((error) => {
      const response: IMqttResponse = { type: "error", success: false, error }
      return obj2Str(response)
    })
    .finally(() => {
      MqttStaticUtil.mq?.unsubscribe(optionsObj.topic)
    })
}

export function unsubscribeTopic(topic: string) {
  return MqttStaticUtil.mq?.unsubscribe(topic)
}

export function disconnectMqtt() {
  MqttStaticUtil.mq?.disconnect()
}

function dealResponse(result: IMqttData, topic?: string): string {
  const response: IMqttResponse = { type: "message", success: true, topic, data: result }
  return obj2Str(response)
}

export function setEnvParams(envParam: string) {
  const params = JSON.parse(envParam) as IMqttClient

  MqttStaticUtil.init(mqtt, {
    brokerUrl: params.brokerUrl,
    username: params.username,
    mqttPath: params.mqttPath,
    clientId: params.clientId,
  })
  MqttStaticUtil.mq.mainWindowSend = MqttStaticUtil.mainWindowSend = mainWindowSend
}
