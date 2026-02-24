/*
 * @Author: xiongman
 * @Date: 2023-10-13 14:45:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-30 16:57:56
 * @Description:
 */

import { DEVICE_POINT_DATA_WS_TOPIC } from "@configs/mqtt-info.ts"
import { setDvsRunDataStateInfo } from "@hooks/use-matrix-device-list.ts"
import useMqttData from "@hooks/use-mqtt-data.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import AtomRun4DvsData from "@store/atom-run-device.ts"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo, useRef } from "react"

import { TDeviceType } from "@/types/i-config.ts"
import { TDvsTypeRunData4MQ } from "@/types/i-device.ts"

interface IParams {
  isStart: boolean
  deviceTypeList?: TDeviceType[]
}

function getDvsWsTopicMap(deviceTypeList: IParams["deviceTypeList"]) {
  if (!deviceTypeList?.length) return DEVICE_POINT_DATA_WS_TOPIC
  return deviceTypeList.reduce(
    (prev, next) => {
      prev[next] = DEVICE_POINT_DATA_WS_TOPIC[next]
      return prev
    },
    {} as typeof DEVICE_POINT_DATA_WS_TOPIC,
  )
}

export default function useRun4deviceData(params: IParams) {
  const { isStart, deviceTypeList } = params
  const [run4Device, setRun4Device] = useAtom(AtomRun4DvsData)
  const { deviceStdStateMap } = useAtomValue(AtomConfigMap).map
  const dvsStdStateMapRef = useRef(deviceStdStateMap)

  dvsStdStateMapRef.current = deviceStdStateMap
  const mqttCallbackRef = useRef((type: TDeviceType, data: unknown) => {
    Object.values((data || {}) as TDvsTypeRunData4MQ).forEach((item) => {
      setDvsRunDataStateInfo(dvsStdStateMapRef.current, type, item, "old")
    })
    setRun4Device({ type, data: (data || {}) as TDvsTypeRunData4MQ })
  })
  // const topicMapRef = useRef(getDvsWsTopicMap(deviceTypeList))
  const topicMapRef = useMemo(() => getDvsWsTopicMap(deviceTypeList), [deviceTypeList])
  const { setStartMqtt } = useMqttData({ topicMap: topicMapRef, callbackRef: mqttCallbackRef })

  useEffect(() => {
    // 获取设备列表前不做处理
    setStartMqtt(isStart)

    return () => {
      setStartMqtt(false)
    }
  }, [setStartMqtt, isStart])

  return { run4Device }
}
