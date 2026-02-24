/*
 * @Author: chenmeifeng
 * @Date: 2025-04-10 10:32:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-10 14:38:09
 * @Description:
 */

import { WITH_PUBLIC_WS_TOPIC } from "@configs/mqtt-info.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

import { IAlarmMqttInfo, IDvsAlarmData } from "@/types/i-alarm"

interface IParams {
  deviceCode?: string
  setDvsStateAlarmData?: Dispatch<SetStateAction<IDvsAlarmData>>
}

const { topicSuffix } = WITH_PUBLIC_WS_TOPIC["deviceState"]

function dealCftMqRes(mqData): IDvsAlarmData | undefined {
  if (!mqData) return null
  return mqData as IDvsAlarmData
}
export default function useMqttDvsStateAlarm(params: IParams) {
  const { setDvsStateAlarmData } = params || {}
  const mqttDataRef = useRef(new CustomMqtt())
  useEffect(() => {
    const mqtt = mqttDataRef.current
    if (!mqtt || !setDvsStateAlarmData) return () => mqtt?.unsubscribe()
    mqtt.connect({
      topic: topicSuffix,
      callback: (mqData) => {
        const theMqData = dealCftMqRes(mqData)
        setDvsStateAlarmData?.({ ...theMqData })
      },
    })
    return () => mqtt?.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
