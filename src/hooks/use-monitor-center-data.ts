/*
 * @Author: xiongman
 * @Date: 2023-09-21 13:52:13
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-21 13:52:13
 * @Description: 融合区域数据和区域mq数据的hooks方法
 */

import { BASE_DATA_WS_TOPIC } from "@configs/mqtt-info.ts"
import { StorageComprehensive } from "@configs/storage-cfg.ts"
import { calcMonitorCenterInfoRate } from "@pages/area-matrix/methods"
import { AtomCenterInfoData } from "@store/atom-center-info.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { coverFakeData2ServeData } from "@utils/storage-funs.ts"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"

import { ICenterInfoData, ICenterRunDataMQ } from "@/types/i-monitor-info.ts"

export default function useMonitorCenterData(): Partial<ICenterInfoData> {
  const [mqData, setMqData] = useState<ICenterRunDataMQ>()
  const mqttDataRef = useRef(new CustomMqtt())
  const centerInfoData = useAtomValue(AtomCenterInfoData)

  useEffect(() => {
    const mqtt = mqttDataRef.current
    if (!mqtt) return () => {}
    const topic = BASE_DATA_WS_TOPIC["globalCenter"]
    mqtt.connect({
      topic,
      callback: (data) => setMqData(data as ICenterRunDataMQ),
    })
    return () => {
      mqtt.unsubscribe()
    }
  }, [])

  return useMemo(() => {
    const cRunData = coverFakeData2ServeData(StorageComprehensive, mqData)
    if (!centerInfoData || !mqData) return { ...(centerInfoData || {}), ...(cRunData || {}) }
    return calcMonitorCenterInfoRate({ ...centerInfoData }, cRunData)
  }, [centerInfoData, mqData])
}
