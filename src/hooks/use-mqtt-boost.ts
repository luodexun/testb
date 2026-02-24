/*
 * @Author: xiongman
 * @Date: 2023-10-20 16:50:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-10 16:07:07
 * @Description: 获取升压站电气数据的hook
 */

import { WITH_PUBLIC_WS_TOPIC } from "@configs/mqtt-info.ts"
import { MS_SCEND_2 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { queryDevicesByParams } from "@utils/device-funs.ts"
import { createUUID, isEmpty, validResErr } from "@utils/util-funs.tsx"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

import { IBoostMQData, IBoostMQDataRes } from "@/types/i-boost.ts"

interface IParams {
  stationCode?: string
  point?: string
  setBoostMqttData?: Dispatch<SetStateAction<IBoostMQData>>
}

const { publicTopic, topicSuffix, uri } = WITH_PUBLIC_WS_TOPIC["boost"]

const DEF_OPT = { method: "get/post", header: "" }

function dealBoostMqRes(mqData: IBoostMQDataRes): IBoostMQData {
  if (!mqData) return null
  const { payload } = mqData
  if (validResErr(payload) || isEmpty(payload.data)) return null
  return payload.data as IBoostMQData
}
export default function useMqttBoost(params: IParams) {
  const { stationCode, setBoostMqttData, point } = params || {}
  const [dvsCode, setDvsCode] = useState<string>()
  const mqttDataRef = useRef(new CustomMqtt())
  const [reload, setReload] = useRefresh(MS_SCEND_2) // 2 秒
  const timer = useRef(null)
  useEffect(() => {
    ;(async function () {
      const deviceList = await queryDevicesByParams({ stationCode, deviceType: "SYZZZ" })
      if (!deviceList?.length) return
      setDvsCode(deviceList[0]?.deviceCode)
    })()
  }, [stationCode])
  useEffect(() => {
    const mqtt = mqttDataRef.current
    const topic = `${topicSuffix}/${createUUID()}`
    if (!reload || !mqtt || !dvsCode || !point) return () => mqtt?.unsubscribe(topic)
    const parameter = JSON.stringify({ code: dvsCode || "", point: point })

    timer.current = setTimeout(() => {
      setReload(false)
    }, 5000)
    mqtt.connect(
      {
        topic,
        callback: (mqData) => {
          const theMqData = dealBoostMqRes(mqData as IBoostMQDataRes)
          setReload(false)
          clearTimeout(timer.current)
          if (!theMqData) return
          setBoostMqttData?.(theMqData)
        },
      },
      { publicTopic, payload: { uri, ...DEF_OPT, parameter } },
    )
    return () => {
      mqtt?.unsubscribe(topic)
      clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, dvsCode, point])
}
