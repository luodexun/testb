/*
 * @Author: chenmeifeng
 * @Date: 2024-04-03 13:47:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-20 11:10:18
 * @Description: 查询场站所有箱变实时数据的hook
 */

import { WITH_PUBLIC_WS_TOPIC } from "@configs/mqtt-info.ts"
import { MS_SCEND_2 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { createUUID, isEmpty, validResErr } from "@utils/util-funs.tsx"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

import { IQxzMQData, TSWeatherData } from "@/types/i-qxz"

interface IParams {
  stationCode?: string
  code?: string
  startMqtt?: boolean
  setSweatherData?: Dispatch<SetStateAction<TSWeatherData>>
  setDeviceMqList?: any
}

const { publicTopic, topicSuffix, uri } = WITH_PUBLIC_WS_TOPIC["devicemng"]

const DEF_OPT = { method: "get/post", header: "" }

function dealQxzMqRes(mqData: IQxzMQData): TSWeatherData {
  if (!mqData) return null
  const { payload } = mqData
  if (validResErr(payload) || isEmpty(payload.data)) return null
  return payload.data as TSWeatherData
}
export default function useMqttDevicemng(params: IParams) {
  const { startMqtt = true, stationCode, setSweatherData, code, setDeviceMqList } = params || {}
  const mqttDataRef = useRef(new CustomMqtt())
  const [reload, setReload] = useRefresh(MS_SCEND_2) // 2 秒

  useEffect(() => {
    const mqtt = mqttDataRef.current
    const topic = `${topicSuffix}/${createUUID()}`
    if (!startMqtt || !reload || !mqtt || (!stationCode && !code)) return () => mqtt?.unsubscribe(topic)
    const parameter = stationCode
      ? JSON.stringify({ stationCode: stationCode || "" })
      : JSON.stringify({ code: code || "" })

    mqtt.connect(
      {
        topic,
        callback: (mqData) => {
          const theMqData = dealQxzMqRes(mqData as IQxzMQData)
          setReload(false)
          if (!theMqData) return
          setSweatherData ? setSweatherData?.(theMqData) : setDeviceMqList?.(theMqData)
          // setReload(false)
        },
      },
      { publicTopic, payload: { uri, ...DEF_OPT, parameter } },
    )
    return () => mqtt?.unsubscribe(topic)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, stationCode, code, startMqtt])
}
