/*
 * @Author: xiongman
 * @Date: 2024-02-23 14:35:48
 * @LastEditors: xiongman
 * @LastEditTime: 2024-02-23 14:35:48
 * @Description: 用于mqtt相关的全局数据类型定义
 */

import type { AxiosRequestConfig } from "axios"

declare global {
  interface IApiItem extends AxiosRequestConfig {
    desc?: string
    repeat_request?: boolean // 是否允许短时间重复发送请求
    arrayFormat?: "repeat"
    param_field?: "data" | "params" | "hybrid"
  }

  type TMqttCallback = (response: string) => void

  interface IPendingSendList {
    options: IMqttOptions
    publishInfo?: IPublicParam
  }

  interface IPayload {
    uri: string
    method: string
    header?: string
    parameter: string
  }

  interface IPublicParam {
    publicTopic: string
    payload: IApiItem | IPayload
  }

  interface IMqttOptions4Electron {
    topic: string
    mqttUrl?: string
    clientId?: string
    mqttPath?: string
    publicTopic?: string // 发送主题
  }

  interface IMqttOptions extends IMqttOptions4Electron {
    callback: (data: unknown, topic?: string) => void
    // 主进程响应标记
    send2MainKey?: string
    // 主进程响应获取数据后取消订阅标记
    unsubscribe?: boolean
  }

  interface IMqttData {
    headers: AxiosHeaders
    uri: string
    payload: unknown
  }

  interface IMqttResponse {
    type: "message" | "connect" | "subscribe" | "publish" | "error"
    success: boolean
    topic?: string
    data?: unknown
    error?: unknown
  }

  interface IMqttClient {
    brokerUrl?: string
    username?: string
    password?: string
    clientId?: string
    mqttPath?: string
  }
}
