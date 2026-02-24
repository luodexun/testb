/*
 * @Author: chenmeifeng
 * @Date: 2023-10-23 17:51:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-07 10:15:50
 * @Description:
 */

import { WITH_PUBLIC_WS_TOPIC } from "@configs/mqtt-info.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

import { IAlarmMqttInfo } from "@/types/i-alarm"

interface IParams {
  deviceCode?: string
  setAlarmMqttData?: Dispatch<SetStateAction<IAlarmMqttInfo>>
}

const { topicSuffix } = WITH_PUBLIC_WS_TOPIC["customAlarm"]

function dealCftMqRes(mqData): IAlarmMqttInfo | undefined {
  if (!mqData) return
  return mqData as IAlarmMqttInfo
}
export default function useMqttCustomAlarm(params: IParams) {
  const { setAlarmMqttData } = params || {}
  const mqttDataRef = useRef(new CustomMqtt())
  useEffect(() => {
    const mqtt = mqttDataRef.current
    if (!mqtt || !setAlarmMqttData) return () => mqtt?.unsubscribe()
    mqtt.connect({
      topic: topicSuffix,
      callback: (mqData) => {
        const theMqData = dealCftMqRes(mqData)
        setAlarmMqttData?.({ ...theMqData })
      },
    })
    return () => mqtt?.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
