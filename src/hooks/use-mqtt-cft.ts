/*
 * @Author: chenmeifeng
 * @Date: 2023-10-23 17:51:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-17 14:08:12
 * @Description:
 */

import { WITH_PUBLIC_WS_TOPIC } from "@configs/mqtt-info.ts"
import { MS_SCEND_2 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { createUUID, validResErr } from "@utils/util-funs.tsx"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

import { IAgvcInfo, IAgvcMQData, IAgvcMQDataMap } from "@/types/i-tower"

interface IParams {
  deviceCode?: string
  setCftMqttData?: Dispatch<SetStateAction<IAgvcMQDataMap>>
}

const { publicTopic, topicSuffix, uri } = WITH_PUBLIC_WS_TOPIC["cft"]

const DEF_OPT = { method: "get/post", header: "" }

function dealCftMqRes(mqData: IAgvcMQData, deviceCode: string): IAgvcMQDataMap {
  if (!mqData) return
  const { payload } = mqData as IAgvcMQData
  if (validResErr(payload)) return
  return deviceCode ? { [deviceCode]: payload.data as IAgvcInfo } : (payload.data as IAgvcMQDataMap)
}
const timeout = parseInt(process.env.VITE_MQTT_TIMEOUT)
export default function useMqttCft(params: IParams) {
  const { deviceCode, setCftMqttData } = params || {}
  const mqttDataRef = useRef(new CustomMqtt())
  const [reload, setReload] = useRefresh(MS_SCEND_2) // 2 秒
  const timer = useRef(null)
  // const pubParamRef = useRef()

  useEffect(() => {
    const mqtt = mqttDataRef.current
    const topic = `${topicSuffix}/${createUUID()}`
    if (!reload || !mqtt || !deviceCode) return () => mqtt?.unsubscribe(topic)
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
          const theMqData = dealCftMqRes(mqData as IAgvcMQData, deviceCode)
          if (!theMqData) return
          setCftMqttData?.(theMqData)
        },
      },
      {
        publicTopic,
        payload: { uri, ...DEF_OPT, parameter: JSON.stringify({ code: deviceCode || "" }) },
      },
    )
    return () => {
      clearTimeout(timer.current)
      mqtt?.unsubscribe(topic)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceCode, reload])
}
