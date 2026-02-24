/*
 * @Author: xiongman
 * @Date: 2023-10-13 09:54:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-06 11:39:36
 * @Description: 获取mqtt数据的hooks
 */

import CustomMqtt from "@utils/custom-mqtt.ts"
import { MutableRefObject, useEffect, useRef, useState } from "react"

interface IParams<TK extends string = string> {
  topicMap: Partial<Record<TK, string>>
  callbackRef: MutableRefObject<(type: TK, data: unknown) => void>
  publicParamMap?: Record<keyof IParams["topicMap"], IPublicParam>
}

export default function useMqttData<TK extends string = string>(params: IParams<TK>) {
  const { topicMap, callbackRef, publicParamMap } = params
  const [startMqtt, setStartMqtt] = useState(false)
  const mqttClientRef = useRef<Partial<Record<TK, CustomMqtt>>>(null)

  const clearRef = useRef((mqttMap: typeof mqttClientRef.current) => {
    const mqttClients: CustomMqtt[] = Object.values(mqttMap || {})
    mqttClients.forEach((mqtt) => mqtt.unsubscribe())
    mqttClientRef.current = null
  })
  useEffect(() => {
    if (!topicMap) return () => clearMqtt(mqttMap)
    let mqttMap = mqttClientRef.current
    const clearMqtt = clearRef.current
    if (!startMqtt) return () => clearMqtt(mqttMap)

    if (!mqttMap) {
      mqttMap = mqttClientRef.current = {}
      Object.keys(topicMap).forEach((type) => (mqttMap[type] = new CustomMqtt()))
    }
    crtMQOptions(topicMap, callbackRef).forEach(({ type, ...option }) => {
      mqttMap?.[type].connect(option, publicParamMap?.[type])
    })

    return () => clearMqtt(mqttMap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMqtt, topicMap, publicParamMap])

  return { setStartMqtt }
}

function crtMQOptions<TK extends string = string>(
  topicMap: IParams<TK>["topicMap"],
  callback: IParams<TK>["callbackRef"],
) {
  return Object.entries(topicMap).map(([topicKey, topic]) => ({
    type: topicKey,
    topic: topic,
    callback: callback?.current?.bind(null, topicKey as any),
  }))
}
