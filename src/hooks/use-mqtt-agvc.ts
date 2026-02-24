/*
 * @Author: xiongman
 * @Date: 2023-10-20 16:50:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-26 14:46:13
 * @Description:
 */

import { WITH_PUBLIC_WS_TOPIC } from "@configs/mqtt-info.ts"
import { MS_SCEND_2 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { createUUID, validResErr } from "@utils/util-funs.tsx"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

import { IAgvcMQData, IAgvcMQDataMap } from "@/types/i-agvc.ts"

interface IParams {
  isStart: boolean
  deviceCode?: string
  setAgvcMqttData?: Dispatch<SetStateAction<IAgvcMQDataMap>>
}

const { publicTopic, topicSuffix, uri } = WITH_PUBLIC_WS_TOPIC["agvc"]

const DEF_OPT = { method: "get/post", header: "" }

function dealAgvcMqRes(mqData: IAgvcMQData): IAgvcMQDataMap {
  if (!mqData) return null
  const { payload } = mqData as IAgvcMQData
  if (validResErr(payload)) return null
  return payload.data as IAgvcMQDataMap
}
const timeout = parseInt(process.env.VITE_MQTT_TIMEOUT)
export default function useMqttAgvc(params: IParams) {
  const { isStart, deviceCode, setAgvcMqttData } = params || {}
  const mqttDataRef = useRef(new CustomMqtt())
  const [reload, setReload] = useRefresh(MS_SCEND_2) // 2 秒
  const timer = useRef(null)

  const pubParamRef = useRef({
    publicTopic,
    payload: { uri, ...DEF_OPT, parameter: JSON.stringify({ code: deviceCode || "" }) },
  })

  useEffect(() => {
    const mqtt = mqttDataRef.current
    const topic = `${topicSuffix}/${createUUID()}`
    if (!reload || !mqtt || !isStart) return () => mqtt?.unsubscribe(topic)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setReload(false)
    }, timeout)
    mqtt.connect(
      {
        topic,
        callback: (mqData) => {
          setReload(false)
          clearTimeout(timer.current)
          const theMqData = dealAgvcMqRes(mqData as IAgvcMQData)
          if (!theMqData) return
          setAgvcMqttData?.(theMqData)
        },
      },
      pubParamRef.current,
    )
    return () => {
      clearTimeout(timer.current)
      mqtt?.unsubscribe(topic)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceCode, reload, isStart])
}
