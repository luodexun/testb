/*
 * @Author: xiongman
 * @Date: 2023-10-20 16:50:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-17 16:06:09
 * @Description: 获取升压站电气数据的hook
 */

import { WITH_PUBLIC_WS_TOPIC } from "@configs/mqtt-info.ts"
import { MS_SCEND_2 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { createUUID, isEmpty, validResErr } from "@utils/util-funs.tsx"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

import { IQxzMQData, TSWeatherData } from "@/types/i-qxz"

interface IParams {
  deviceCode?: string
  setSweatherData?: Dispatch<SetStateAction<TSWeatherData>>
}

const { publicTopic, topicSuffix, uri } = WITH_PUBLIC_WS_TOPIC["qxz"]

const DEF_OPT = { method: "get/post", header: "" }

function dealQxzMqRes(mqData: IQxzMQData): TSWeatherData {
  if (!mqData) return null
  const { payload } = mqData
  if (validResErr(payload) || isEmpty(payload.data)) return null
  return payload.data as TSWeatherData
}
const timeout = parseInt(process.env.VITE_MQTT_TIMEOUT)
export default function useMqttQxz(params: IParams) {
  const { deviceCode, setSweatherData } = params || {}
  const mqttDataRef = useRef(new CustomMqtt())
  const [reload, setReload] = useRefresh(MS_SCEND_2) // 2 秒
  const timer = useRef(null)
  useEffect(() => {
    const mqtt = mqttDataRef.current
    const topic = `${topicSuffix}/${createUUID()}`
    if (!reload || !mqtt || !deviceCode) return () => mqtt?.unsubscribe(topic)
    const parameter = JSON.stringify({ code: deviceCode || "" })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setReload(false)
    }, timeout)
    mqtt.connect(
      {
        topic,
        callback: (mqData) => {
          setReload(false)
          const theMqData = dealQxzMqRes(mqData as IQxzMQData)
          clearTimeout(timer.current)
          if (!theMqData) return
          setSweatherData?.(theMqData)
        },
      },
      { publicTopic, payload: { uri, ...DEF_OPT, parameter } },
    )
    return () => {
      clearTimeout(timer.current)
      mqtt?.unsubscribe(topic)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, deviceCode])
}
